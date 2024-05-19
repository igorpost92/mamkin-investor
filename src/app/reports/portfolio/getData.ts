'use server';

import { tinkoffOpenApi } from '../../../shared/api/tinkoffOpenApi';
import { parseTinkoffNumber } from '../../../shared/api/tinkoffOpenApi/utils';
import { sumBy } from 'lodash';
import { Asset } from '../../../shared/db/entities';
import { getDB } from '../../../shared/db';
import { getCurrencyIsin } from '../../../shared/api/tinkoffOpenApi/constants';
import { getComplexData } from '../getComplexData';

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

interface Params {
  brokerId?: string;
  currency?: string;
}

export const getPortfolioData = async (params?: Params) => {
  const { positions } = await getComplexData(params);

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
      amountInRubDelta:
        priceNum && item.avgPrice ? (priceNum - item.avgPrice) * item.quantity : undefined,
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
