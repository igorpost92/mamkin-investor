import { tinkoffOpenApi } from '../../shared/api/tinkoffOpenApi';
import { parseTinkoffNumber } from '../../shared/api/tinkoffOpenApi/utils';
import { sumBy } from 'lodash';
import { Asset } from '../../shared/db/entities';
import { getDB } from '../../shared/db';
import { instanceToPlain } from 'class-transformer';
import { getCurrencyIsin } from '../../shared/api/tinkoffOpenApi/constants';

interface Position {
  asset: Asset;
  avgPrice: number;
  quantity: number;
}

// TODO: refacto

const getPositions = async (brokerId?: string) => {
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
                date: Date;
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
    let existingAssetAcc = acc[doc.assetId as string];
    if (!existingAssetAcc) {
      existingAssetAcc = {};
      acc[doc.assetId] = existingAssetAcc;
    }

    let existingBroker = existingAssetAcc[doc.brokerId as string];
    if (!existingBroker) {
      existingBroker = [];
      existingAssetAcc[doc.brokerId] = existingBroker;
    }

    if (doc.operation === 'buy') {
      let quantityLeft = doc.quantity as number;

      while (quantityLeft > 0) {
        const shortRowIndex = existingBroker.findIndex(item => item.quantity < 0);

        if (shortRowIndex >= 0) {
          const record = existingBroker[shortRowIndex];
          let quantity = Math.min(quantityLeft, Math.abs(record.quantity));

          quantityLeft -= quantity;
          record.quantity += quantity;

          if (record.quantity === 0) {
            existingBroker.splice(shortRowIndex, 1);
          }

          continue;

          // TODO: moves
        }

        existingBroker.push({
          buyPrice: doc.price,
          date: doc.date,
          quantity: quantityLeft,
        });

        moves.push({
          type: doc.operation,
          assetId: doc.assetId,
          brokerId: doc.brokerId,
          quantity: doc.quantity,
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
        const record = existingBroker[accIndex];

        if (!record) {
          existingBroker.push({
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
          existingBroker.shift();
        }
      }

      return;
    }

    if (doc.operation === 'split') {
      existingBroker.forEach(item => {
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
      let newBroker = existingAssetAcc[doc.brokerTo as string];
      if (!newBroker) {
        newBroker = [];
        existingAssetAcc[doc.brokerTo] = newBroker;
      }

      let quantityLeft = doc.quantity as number;
      const accIndex = 0;

      while (quantityLeft > 0) {
        const record = existingBroker[accIndex];

        let quantity = Math.min(Number(record.quantity), Number(quantityLeft));

        newBroker.push({
          buyPrice: record.buyPrice,
          date: record.date,
          quantity: quantity,
        });

        record.quantity -= quantity;
        quantityLeft -= quantity;

        if (record.quantity === 0) {
          existingBroker.shift();
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

    // TODO: refacto
    const brokersList = brokerId ? [brokers[brokerId]] : Object.values(brokers);
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

    const asset = instanceToPlain(assets.find(item => item.id === assetId)) as Asset;

    positions.push({
      asset,
      avgPrice,
      quantity,
    });
  });

  return positions;
};

const getCurrencyRate = async (currency: string) => {
  const isin = getCurrencyIsin(currency);

  if (!isin) {
    return;
  }

  const db = await getDB();
  const repo = db.getRepository(Asset);
  const asset = await repo.findOne({ where: { isin } });

  if (!asset?.instrumentUid) {
    return;
  }

  const [{ price }] = await tinkoffOpenApi.getClosePrices([asset.instrumentUid]);

  if (!price) {
    return;
  }

  return Number(parseTinkoffNumber(price));
};

// TODO: filter brokerId?: string
export const getPortfolioData = async () => {
  const positions = await getPositions();

  const uids = positions.map(item => item.asset.instrumentUid).filter(Boolean) as string[];

  const prices = await tinkoffOpenApi.getClosePrices(uids);

  // TODO: default
  const usdRate = (await getCurrencyRate('USD')) ?? 90;
  const kztRate = ((await getCurrencyRate('KZT')) ?? 20.77) / 100; // TODO:

  const dataWithPrices = positions.map(item => {
    const price = prices.find(priceItem => priceItem.instrumentUid === item.asset.instrumentUid)
      ?.price;

    let priceNum;
    if (price) {
      priceNum = Number(parseTinkoffNumber(price));
    } else {
      // TODO: for kzt find different api
      // priceNum = item.avgPrice;
    }

    if (priceNum && item.asset.type === 'bond') {
      // TODO: bonds price
      priceNum *= 10;
    }

    let priceDelta;
    if (priceNum) {
      priceDelta = (priceNum / item.avgPrice - 1) * 100;
    }

    // TODO: nulls
    const calcPrice = priceNum ?? item.avgPrice;

    const amount = Number(item.quantity) * calcPrice;

    let currencyRate = 1;
    if (item.asset.currency === 'USD') {
      currencyRate = usdRate;
    } else if (item.asset.currency === 'KZT') {
      currencyRate = kztRate;
    }

    const amountInRub = amount * currencyRate;

    return {
      ...item,
      price: priceNum,
      priceDelta,
      amount: amount,
      amountInRub: amountInRub,
    };
  });

  const rub = sumBy(
    dataWithPrices.filter(item => item.asset.currency === 'RUB'),
    data => data.amount,
  );

  const usd = sumBy(
    dataWithPrices.filter(item => item.asset.currency === 'USD'),
    data => data.amount,
  );

  const kzt = sumBy(
    dataWithPrices.filter(item => item.asset.currency === 'KZT'),
    data => data.amount,
  );

  const totalAmount = rub + usd * usdRate + kzt * kztRate;

  const dataWithWeight = dataWithPrices.map(item => {
    const weight = (item.amountInRub / totalAmount) * 100;

    return {
      ...item,
      weight,
    };
  });

  return dataWithWeight;
};
