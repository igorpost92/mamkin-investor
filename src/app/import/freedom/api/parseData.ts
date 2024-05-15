import { FreedomOperation } from '../types';
import { getCurrencyIsin } from '../../../../shared/api/tinkoffOpenApi/constants';

const parseDate = (dateStr: string) => {
  return new Date(`${dateStr}+0500`);
};

const parseAssetType = (type: string) => {
  const mapping: Record<string, string> = {
    валюта: 'currency',
    'акция обыкновенная': 'share',
    'фонд/ETF': 'etf',
  };

  const result = mapping[type];

  if (!result) {
    throw new Error(`Unknown asset type: ${result}`);
  }

  return result;
};

const parseCurrency = (currency: string) => {
  return currency === 'RUR' ? 'RUB' : currency;
};

export const parseData = async (content: string) => {
  const data = JSON.parse(content);

  const operations: FreedomOperation[] = [];

  const tradesList = data.trades.detailed;

  tradesList.forEach(item => {
    let operationType = item.operation;
    if (operationType === 'buy') {
      operationType = 'purchase';
    }

    if (!['purchase', 'sell'].includes(operationType)) {
      throw new Error(`Unknown operation type: ${operationType}`);
    }

    const assetType = parseAssetType(item.instr_kind);

    let assetName;
    let ticker;
    let isin = item.isin;
    let currency;

    if (assetType === 'currency') {
      operationType = operationType === 'purchase' ? 'sell' : 'purchase';

      const pair = item.instr_nm as string;
      const [assetFrom, assetTo] = pair.split('/').map(parseCurrency);

      if (assetTo !== 'USD') {
        throw new Error(`Something is wrong with currency pair: ${pair}`);
      }

      isin = getCurrencyIsin(assetTo);

      if (!isin) {
        throw new Error(`Can't find isin for currency: ${assetTo}`);
      }

      ticker = isin;
      assetName = assetTo;
      currency = assetFrom;
    } else if (assetType === 'share' || assetType === 'etf') {
      assetName = item.instr_nm;
      ticker = item.instr_nm;
      currency = item.curr_c;
    } else {
      throw new Error(`Can't parse asset type: ${assetType}`);
    }

    const date = parseDate(item.date);
    const orderId = item.order_id;
    const price = item.p;
    const quantity = item.q;
    // TODO: not so much precise data
    const sum = item.summ;

    // TODO: commissions

    const operation = {
      id: orderId,
      type: operationType,
      date,
      asset: {
        name: assetName,
        type: assetType,
        ticker,
        isin,
        currency: assetType !== 'currency' ? currency : undefined,
      },
      currency,
      price,
      quantity,
      sum,
    };

    operations.push(operation);
  });

  return operations;
};
