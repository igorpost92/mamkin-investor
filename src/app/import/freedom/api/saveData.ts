import { brokers } from '../../../../shared/constants';
import {
  Asset,
  Broker,
  NewAsset,
  NewBroker,
  NewPurchase,
  NewSell,
  Purchase,
  Sell,
} from '../../../../shared/db/entities';
import { getDB, NewTx } from '../../../../shared/db';
import { FreedomAssetInfo, FreedomOperation } from '../types';

const getOrCreateBroker = async (tx: NewTx) => {
  const id = brokers.freedom;

  const repo = tx.getRepository(Broker);
  const broker = await repo.findOne({ where: { id } });

  if (broker) {
    return broker.id;
  }

  const newBroker: NewBroker = {
    id,
    name: 'Фридом финанс КЗ',
  };

  const result = await repo.insert(newBroker);
  return result.identifiers[0].id;
};

const getOrCreateAsset = async (assetInfo: FreedomAssetInfo, tx: NewTx, onCreate: () => void) => {
  const { isin } = assetInfo;

  const repo = tx.getRepository(Asset);
  const asset = await repo.findOne({ where: { isin } });

  if (asset) {
    return asset.id;
  }

  const newAsset: NewAsset = {
    name: assetInfo.name,
    isin,
    ticker: assetInfo.ticker,
    type: assetInfo.type,
    currency: assetInfo.currency,
  };

  const result = await repo.insert(newAsset);

  onCreate();
  console.log(`created asset: ${assetInfo.name}`);

  return result.identifiers[0].id;
};

export const saveData = async (operations: FreedomOperation[]) => {
  const count = {
    asset: 0,
    // deposit: 0,
    // dividend: 0,
    purchase: 0,
    sell: 0,
    // withdraw: 0,
  };

  console.log('saving start, operations count -', operations.length);

  const db = await getDB();
  await db.transaction(async tx => {
    const brokerId = await getOrCreateBroker(tx);

    for (const operation of operations) {
      if (operation.type === 'purchase' || operation.type === 'sell') {
        const assetId = await getOrCreateAsset(operation.asset, tx, () => {
          count.asset++;
        });

        const newItem: NewPurchase | NewSell = {
          date: operation.date,
          brokerId,
          assetId,
          quantity: operation.quantity,
          currency: operation.currency,
          price: operation.price,
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

      // TODO: rest operations
      throw new Error(`Unknown operation type ${operation.type}`);
    }

    console.log('saving end, count - ', count);
  });
};
