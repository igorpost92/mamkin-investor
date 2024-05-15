import { TinkoffOperation } from './types';
import {
  InstrumentWithType,
  TinkoffAsset,
  tinkoffOpenApi,
} from '../../../../../shared/api/tinkoffOpenApi';
import { getDB, NewTx } from '../../../../../shared/db';
import { brokers } from '../../../../../shared/constants';
import {
  Asset,
  Broker,
  Deposit,
  Dividend,
  NewAsset,
  NewBroker,
  NewDeposit,
  NewDividend,
  NewPurchase,
  NewSell,
  NewTransfer,
  NewWithdrawal,
  Purchase,
  Sell,
  Transfer,
  Withdrawal,
} from '../../../../../shared/db/entities';

interface AssetInfo {
  instrumentUid: string;
  assetUid: string;
  type: string;
}

const wait = () => new Promise(res => setTimeout(res, 61 * 1000));

const tryTo = async <T>(fn: () => Promise<T>) => {
  try {
    const result = await fn();
    return result;
  } catch (e) {
    await wait();
    return fn();
  }
};

const getOrCreateBroker = async (tx: NewTx) => {
  const id = brokers.tinkoff;

  const repo = tx.getRepository(Broker);
  const broker = await repo.findOne({ where: { id } });

  if (broker) {
    return broker.id;
  }

  const newBroker: NewBroker = {
    id,
    name: 'Тинькофф',
  };

  const result = await repo.insert(newBroker);
  return result.identifiers[0].id;
};

const getOrCreateUnknownAsset = async (tx: NewTx) => {
  const id = '11111111-1111-1111-1111-111111111111';

  const repo = tx.getRepository(Asset);
  const asset = await repo.findOne({ where: { id } });

  if (asset) {
    return asset;
  }

  const newAsset: NewAsset = {
    id,
    name: '___UNKNOWN___ASSET___',
  };

  const result = await repo.insert(newAsset);
  return result.identifiers[0].id;
};

const findInstrumentInApi = async (
  instruments: InstrumentWithType[],
  assets: any[],
  assetInfo: AssetInfo,
) => {
  // TODO: refacto
  if (!['share', 'bond', 'currency', 'etf'].includes(assetInfo.type)) {
    throw new Error(`Unknown asset type: ${assetInfo.type}`);
  }

  const asset = assets.find(item => item.uid === assetInfo.assetUid);

  if (asset) {
    if (asset.instruments.length === 1) {
      const instrumentId = asset.instruments[0].uid;
      const inst = instruments.find(item => item.instrument.uid === instrumentId);

      if (inst) {
        return inst.instrument;
      }

      let instrument = await tryTo(() => tinkoffOpenApi.getInstrument(instrumentId));

      if (!instrument) {
        throw new Error(`Unknown asset ${instrumentId}`);
      }

      return instrument;
    }

    let inst = instruments.find(item => item.instrument.uid === assetInfo.instrumentUid);

    if (inst) {
      return inst.instrument;
    }

    let instrument = await tryTo(() => tinkoffOpenApi.getInstrument(assetInfo.instrumentUid));

    if (!instrument) {
      throw new Error(`Unknown asset ${assetInfo.instrumentUid}`);
    }

    console.log('found ins:', instrument.name);
    return instrument;
  }

  // TODO: if not found
};

const getOrCreateAsset = async (
  instruments: InstrumentWithType[],
  assets: TinkoffAsset[],
  assetInfo: AssetInfo,
  tx: NewTx,
  onCreate: () => void,
): Promise<string> => {
  if (!assetInfo.instrumentUid) {
    // TODO: dsca
    const assetId = await getOrCreateUnknownAsset(tx);
    return assetId;
  }

  const repo = tx.getRepository(Asset);
  const assetInDb = await repo.findOne({ where: { uid: assetInfo.assetUid } });

  if (assetInDb) {
    return assetInDb.id;
  }

  const instrument = await findInstrumentInApi(instruments, assets, assetInfo);

  if (!instrument) {
    throw new Error(`No instrument found for uid: ${assetInfo.assetUid}`);
  }

  const newAsset: NewAsset = {
    type: assetInfo.type,
    uid: assetInfo.assetUid,
    name: instrument.name,
    instrumentUid: instrument.uid,
    isin: instrument.isin,
    ticker: instrument.ticker,
    currency: instrument.currency.toUpperCase(),
  };

  const result = await repo.insert(newAsset);
  onCreate();
  return result.identifiers[0].id;
};

export const saveOperations = async (operations: TinkoffOperation[]) => {
  const assets = await tinkoffOpenApi.getAssets();
  const instruments = await tinkoffOpenApi.getMergedInstruments();

  const count = {
    asset: 0,
    withdraw: 0,
    purchase: 0,
    dividend: 0,
    sell: 0,
    deposit: 0,
    transfer: 0,
  };

  console.log('saving start, operations count -', operations.length);

  const db = await getDB();
  await db.transaction(async tx => {
    const brokerId = await getOrCreateBroker(tx);

    for (const operation of operations) {
      if (operation.type === 'deposit' || operation.type === 'withdrawal') {
        const newItem: NewDeposit | NewWithdrawal = {
          date: operation.date,
          brokerId,
          currency: operation.currency,
          sum: operation.sum,
          brokerTransactionId: operation.id,
        };

        const repo = tx.getRepository(operation.type === 'deposit' ? Deposit : Withdrawal);
        await repo.insert(newItem);

        if (operation.type === 'deposit') {
          count.deposit++;
        } else {
          count.withdraw++;
        }

        continue;
      }

      if (operation.type === 'purchase' || operation.type === 'sell') {
        const assetId = await getOrCreateAsset(
          instruments,
          assets,
          operation.asset,
          tx,
          () => count.asset++,
        );

        const newItem: NewPurchase | NewSell = {
          date: operation.date,
          brokerId,
          assetId,
          quantity: operation.qty,
          currency: operation.currency,
          // TODO:
          price: operation.sum / operation.qty,
          sum: operation.sum,
          brokerTransactionId: operation.id,
        };

        const repo = tx.getRepository(operation.type === 'purchase' ? Purchase : Sell);
        await repo.insert(newItem);

        if (operation.type === 'purchase') {
          count.purchase++;
        } else {
          count.sell++;
        }

        continue;
      }

      if (operation.type === 'dividend') {
        const assetId = await getOrCreateAsset(
          instruments,
          assets,
          operation.asset,
          tx,
          () => count.asset++,
        );

        const newItem: NewDividend = {
          date: operation.date,
          brokerId,
          assetId,
          currency: operation.currency,
          sum: operation.sum,
          brokerTransactionId: operation.id,
        };

        const repo = tx.getRepository(Dividend);
        await repo.insert(newItem);

        count.dividend++;
        continue;
      }

      if (operation.type === 'transfer') {
        const assetId = await getOrCreateAsset(
          instruments,
          assets,
          operation.asset,
          tx,
          () => count.asset++,
        );

        const newItem: NewTransfer = {
          date: operation.date,
          brokerFromId: brokerId,
          brokerToId: brokerId,
          assetId,
          quantity: operation.qty,
          // TODO:
          // brokerTransactionId: operation.id,
        };

        const repo = tx.getRepository(Transfer);
        await repo.insert(newItem);

        count.transfer++;
        continue;
      }

      throw new Error(`unknown operation type: ${operation.type}`);
    }
  });

  console.log('saving end, count - ', count);

  return count;
};
