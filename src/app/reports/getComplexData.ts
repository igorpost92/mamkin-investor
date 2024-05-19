import { Asset } from '../../shared/db/entities';
import { getDB } from '../../shared/db';
import { sumBy } from 'lodash';
import { instanceToPlain } from 'class-transformer';

interface Position {
  asset: Asset;
  avgPrice: number;
  quantity: number;
}

// TODO: refacto

interface Params {
  brokerId?: string;
  currency?: string;
}

export const getComplexData = async (params?: Params) => {
  // todo objects instead of columns

  const query = `
    select 
      q.*, a.name asset
    from (
      select "assetId", "brokerId", date, price, quantity, sum, 'buy' operation, null::uuid "brokerTo"
      from purchases
      
      union all
      
      select "assetId", "brokerId", date, price, quantity, sum, 'sell', null
      from sells
      
      union all
      
      select "assetId", b.id "brokerId", date, null, ratio, null, 'split', null
      from splits, brokers b
      
      union all
      select "assetId", "brokerFromId", date, null, quantity, null, 'transfer', "brokerToId"
      from transfers
    ) q
    join assets a on a.id = q."assetId"
    where a.type != 'currency'
    --and a.ticker = 'RU000A1059N9'
    order by date
  ;`;

  const db = await getDB();
  const res = await db.query(query);

  interface Acc {
    [assetId: string]:
      | undefined
      | {
          [brokerId: string]:
            | undefined
            | {
                // todo add sellDate, sellPrice for shorts
                // TODO: rename to buyDate
                date: Date;
                // TODO: optional
                buyPrice: number;
                quantity: number;
              }[];
        };
  }

  const acc: Acc = {};

  interface Move {
    assetId: string;
    brokerId: string;
    quantity: string;
    buyDate: Date;
    buyPrice: string;
    sellDate?: Date | null;
    sellPrice?: string | null;
    type: 'buy' | 'sell' | 'split' | 'transfer';
  }

  const moves: Move[] = [];

  res.forEach(doc => {
    let currentAssetAcc = acc[doc.assetId as string];
    if (!currentAssetAcc) {
      currentAssetAcc = {};
      acc[doc.assetId] = currentAssetAcc;
    }

    let currentBroker = currentAssetAcc[doc.brokerId as string];
    if (!currentBroker) {
      currentBroker = [];
      currentAssetAcc[doc.brokerId] = currentBroker;
    }

    if (doc.operation === 'buy') {
      let quantityLeft = doc.quantity as number;

      while (quantityLeft > 0) {
        const shortRowIndex = currentBroker.findIndex(item => item.quantity < 0);

        if (shortRowIndex >= 0) {
          const record = currentBroker[shortRowIndex];
          let quantity = Math.min(quantityLeft, Math.abs(record.quantity));

          quantityLeft -= quantity;
          record.quantity += quantity;

          if (record.quantity === 0) {
            currentBroker.splice(shortRowIndex, 1);
          }

          // TODO: moves

          // moves.push({
          //   type: doc.operation,
          //   assetId: doc.assetId,
          //   brokerId: doc.brokerId,
          //   quantity: quantity,
          //   buyDate: doc.date,
          //   buyPrice: doc.price,
          // });

          continue;
        }

        currentBroker.push({
          buyPrice: doc.price,
          date: doc.date,
          quantity: quantityLeft,
        });

        moves.push({
          type: doc.operation,
          assetId: doc.assetId,
          brokerId: doc.brokerId,
          quantity: quantityLeft,
          buyDate: doc.date,
          buyPrice: doc.price,
        });

        quantityLeft = 0;
      }

      return;
    }

    if (doc.operation === 'sell') {
      let quantityLeft = doc.quantity as number;
      const accIndex = 0;

      while (quantityLeft > 0) {
        const record = currentBroker[accIndex];

        if (!record) {
          currentBroker.push({
            // buyPrice: doc.price,
            date: doc.date,
            quantity: -quantityLeft,
          });

          quantityLeft = 0;

          // TODO: moves
          continue;
        }

        let quantity = Math.min(Number(record.quantity), Number(quantityLeft));

        moves.push({
          type: doc.operation,
          assetId: doc.assetId,
          brokerId: doc.brokerId,
          quantity: -quantity,
          buyDate: record.date,
          buyPrice: record.buyPrice,
          sellDate: doc.date,
          sellPrice: doc.price,
        });

        record.quantity -= quantity;
        quantityLeft -= quantity;

        if (record.quantity === 0) {
          currentBroker.shift();
        }
      }

      return;
    }

    if (doc.operation === 'split') {
      currentBroker.forEach(item => {
        if (new Date(item.date) < new Date(doc.date)) {
          moves.push({
            type: doc.operation,
            assetId: doc.assetId,
            brokerId: doc.brokerId,
            quantity: -item.quantity,
            buyDate: item.date,
            buyPrice: item.buyPrice,
          });

          item.quantity *= doc.quantity;
          item.buyPrice /= doc.quantity;

          moves.push({
            type: doc.operation,
            assetId: doc.assetId,
            brokerId: doc.brokerId,
            quantity: item.quantity,
            buyDate: item.date,
            buyPrice: item.buyPrice,
          });
        }
      });

      return;
    }

    if (doc.operation === 'transfer') {
      let newBroker = currentAssetAcc[doc.brokerTo as string];
      if (!newBroker) {
        newBroker = [];
        currentAssetAcc[doc.brokerTo] = newBroker;
      }

      let quantityLeft = doc.quantity as number;
      const accIndex = 0;

      while (quantityLeft > 0) {
        const record = currentBroker[accIndex];

        let quantity = Math.min(Number(record.quantity), Number(quantityLeft));

        newBroker.push({
          buyPrice: record.buyPrice,
          date: record.date,
          quantity: quantity,
        });

        record.quantity -= quantity;
        quantityLeft -= quantity;

        if (record.quantity === 0) {
          currentBroker.shift();
        }

        moves.push({
          type: doc.operation,
          assetId: doc.assetId,
          brokerId: doc.brokerId,
          quantity: -quantity,
          buyDate: record.date,
          buyPrice: record.buyPrice,
        });

        moves.push({
          type: doc.operation,
          assetId: doc.assetId,
          brokerId: doc.brokerTo,
          quantity: quantity,
          buyDate: record.date,
          buyPrice: record.buyPrice,
        });
      }

      return;
    }
  });

  const assets = await db.getRepository(Asset).find();

  const positions: Position[] = [];

  Object.entries(acc).forEach(([assetId, brokers]) => {
    if (!brokers) {
      return;
    }

    const asset = instanceToPlain(assets.find(item => item.id === assetId)) as Asset;

    if (params?.currency && asset.currency !== params.currency) {
      return;
    }

    // TODO: refacto
    const brokersList = params?.brokerId ? [brokers[params.brokerId]] : Object.values(brokers);
    const records = brokersList.flat();

    const quantity = sumBy(records, item => {
      if (!item) {
        return 0;
      }
      return Number(item.quantity);
    });

    if (!quantity) {
      return;
    }

    const sum = sumBy(records, item => {
      if (!item) {
        return 0;
      }
      return item.quantity * item.buyPrice;
    });

    const avgPrice = sum / quantity;

    positions.push({
      asset,
      avgPrice,
      quantity,
    });
  });

  return { positions, moves };
};
