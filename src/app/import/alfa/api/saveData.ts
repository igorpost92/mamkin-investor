import { AlfaOperation, TradingOperation } from './types';
import { getDb, Transaction } from '../../../../shared/db';
import {
  assetsTable,
  brokersTable,
  depositsTable,
  NewAsset,
  NewBroker,
  NewDeposit,
  NewPurchase,
  NewSell,
  NewWithdrawal,
  purchasesTable,
  sellsTable,
  withdrawalsTable,
} from '../../../../shared/db/schema';
import { eq } from 'drizzle-orm';

const getOrCreateAsset = async (operation: TradingOperation, tx: Transaction): Promise<string> => {
  const { isin } = operation;

  let [asset] = await tx.select().from(assetsTable).where(eq(assetsTable.isin, isin));

  if (asset) {
    return asset.id;
  }

  const newAsset: NewAsset = {
    name: operation.asset,
    isin,
    currency: operation.currency,
  };

  [asset] = await tx.insert(assetsTable).values(newAsset).returning();

  console.log(`created asset: ${operation.asset}`);

  // TODO: count new assets

  return asset.id;
};

const getBrokerId = async (tx: Transaction) => {
  // TODO: name and id const
  const brokerName = 'Альфа';

  let [broker] = await tx.select().from(brokersTable).where(eq(brokersTable.name, brokerName));

  if (!broker) {
    const newBroker: NewBroker = {
      id: '0487b3c0-b181-4fd2-9a2e-500f52254c20',
      name: brokerName,
    };

    const item = await tx.insert(brokersTable).values(newBroker).returning();
    broker = item[0];
  }

  return broker.id;
};

export const saveData = async (operations: AlfaOperation[]) => {
  const count = {
    deposit: 0,
    // TODO:
    // dividend: 0,
    purchase: 0,
    sell: 0,
    withdraw: 0,
  };

  console.log('saving start, operations count -', operations.length);

  const db = await getDb();
  await db.transaction(async tx => {
    const brokerId = await getBrokerId(tx);

    for (const operation of operations) {
      // TODO: if already exists

      if (operation.type === 'deposit' || operation.type === 'withdraw') {
        if (operation.type === 'withdraw') {
          // TODO: check if everything is working
          throw new Error('check withdraw!');
        }

        const table = operation.type === 'deposit' ? depositsTable : withdrawalsTable;

        const newItem: NewDeposit | NewWithdrawal = {
          date: operation.date,
          brokerId,
          sum: operation.sum,
          currency: operation.currency,
        };

        await tx.insert(table).values(newItem);

        if (operation.type === 'deposit') {
          count.deposit++;
        } else {
          count.withdraw++;
        }

        continue;
      }

      if (operation.type === 'purchase' || operation.type === 'sell') {
        if (operation.type === 'sell') {
          // TODO: check if everything is working
          throw new Error('check sell!');
        }

        const table = operation.type === 'purchase' ? purchasesTable : sellsTable;

        const assetId = await getOrCreateAsset(operation, tx);

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

        await tx.insert(table).values(newItem);

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
