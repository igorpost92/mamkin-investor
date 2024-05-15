import { AlfaOperation, TradingOperation } from './types';
import { brokers } from '../../../../shared/constants';
import { getDB, NewTx } from '../../../../shared/db';
import {
  Asset,
  Broker,
  Deposit,
  NewAsset,
  NewBroker,
  NewDeposit,
  NewPurchase,
  NewSell,
  NewWithdrawal,
  Purchase,
  Sell,
  Withdrawal,
} from '../../../../shared/db/entities';

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

const getBrokerId = async (tx: NewTx) => {
  const id = brokers.alfa;

  const repo = tx.getRepository(Broker);
  const broker = await repo.findOne({ where: { id } });

  if (broker) {
    return broker.id;
  }

  const newBroker: NewBroker = {
    id,
    name: 'Альфа',
  };

  const result = await repo.insert(newBroker);
  return result.identifiers[0].id;
};

export const saveData = async (operations: AlfaOperation[]) => {
  const count = {
    asset: 0,
    deposit: 0,
    // TODO:
    // dividend: 0,
    purchase: 0,
    sell: 0,
    withdraw: 0,
  };

  console.log('saving start, operations count -', operations.length);

  const db = await getDB();
  await db.transaction(async tx => {
    const brokerId = await getBrokerId(tx);

    for (const operation of operations) {
      // TODO: if already exists

      if (operation.type === 'deposit' || operation.type === 'withdrawal') {
        if (operation.type === 'withdrawal') {
          // TODO: check if everything is working
          throw new Error('check withdraw!');
        }

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

      throw new Error(`Unknown operation type ${operation.type}`);
    }
  });

  console.log('saving end, count - ', count);
};
