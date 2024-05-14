import { FinamOperation, TradingOperation } from './types';
import { getDB, NewTx } from '../../../../shared/db';
import {
  Deposit,
  Purchase,
  Sell,
  Withdrawal,
  NewAsset,
  NewBroker,
  NewDeposit,
  NewDividend,
  NewPurchase,
  NewSell,
  NewWithdrawal,
  Asset,
  Broker,
  Dividend,
} from '../../../../shared/db/entities';
import { brokers } from '../../../../shared/constants';

const getOrCreateAsset = async (
  operation: TradingOperation,
  tx: NewTx,
  onCreate: () => void,
): Promise<string> => {
  const { isin } = operation;

  const repo = tx.getRepository(Asset);
  const asset = await repo.findOne({ where: { isin } });

  if (asset) {
    return asset.id;
  }

  const newAsset: NewAsset = {
    name: operation.asset,
    isin,
    currency: operation.currency,
  };

  const result = await repo.insert(newAsset);

  onCreate();
  console.log(`created asset: ${operation.asset}`);

  return result.identifiers[0].id;
};

const getAssetByISIN = async (isin: string, tx: NewTx) => {
  const repo = tx.getRepository(Asset);
  const asset = await repo.findOne({ where: { isin } });

  if (!asset) {
    throw new Error(`ISIN not found ${isin}`);
  }

  return asset.id;
};

const getOrCreateBroker = async (tx: NewTx) => {
  const id = brokers.finam;

  const repo = tx.getRepository(Broker);
  const broker = await repo.findOne({ where: { id } });

  if (broker) {
    return broker.id;
  }

  const newBroker: NewBroker = {
    id,
    name: 'Финам',
  };

  const result = await repo.insert(newBroker);
  return result.identifiers[0].id;
};

export const saveOperations = async (operations: FinamOperation[]) => {
  const count = {
    asset: 0,
    deposit: 0,
    dividend: 0,
    purchase: 0,
    sell: 0,
    withdraw: 0,
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
          sum: operation.sum,
          currency: operation.currency,
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
        const assetId = await getOrCreateAsset(operation, tx, () => {
          count.asset++;
        });

        if (operation.nkd) {
          const newDividend: NewDividend = {
            date: operation.date,
            brokerId,
            assetId,
            currency: operation.currency,
            sum: operation.nkd,
            sumRub: operation.currency === 'RUB' ? operation.nkd : undefined,
          };

          const repo = tx.getRepository(Dividend);
          await repo.insert(newDividend);
        }

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
        const assetId = await getAssetByISIN(operation.isin, tx);

        const newItem: NewDividend = {
          date: operation.date,
          brokerId,
          assetId,
          currency: operation.currency,
          sum: operation.sum,
          sumRub: operation.sumRub,
        };

        const repo = tx.getRepository(Dividend);
        await repo.insert(newItem);

        count.dividend++;
        continue;
      }

      throw new Error(`Unknown operation type ${operation.type}`);
    }
  });

  console.log('saving end, count - ', count);
};
