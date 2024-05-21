import {
  FreedomCashOperation,
  FreedomDividendOperation,
  FreedomOperation,
  FreedomTradingOperation,
} from '../types';
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

const parseTicker = (ticker: string) => {
  // TODO: find another solution, parse trades and securities_flows_json
  const mapping: Record<string, string> = {
    'NVDA.US': 'NVDA',
    'MSFT.US': 'MSFT',
    'VOO.US': 'VOO',
  };

  return mapping[ticker] || ticker;
};

const parseTrades = (tradesList: any[]) => {
  const operations: FreedomTradingOperation[] = [];

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

const parseCashOperations = (list: any[]) => {
  const operations: FreedomCashOperation[] = [];

  list.forEach(item => {
    const type = item.type;
    let sum = parseFloat(item.amount);
    let operationType: FreedomCashOperation['type'];

    if (['dividend', 'dividend_reverted', 'tax', 'tax_reverted'].includes(type)) {
      return;
    }

    if (type === 'bank') {
      if (sum < 0) {
        throw new Error('Bank withdrawal is not ready');
      }
      operationType = 'deposit';
    } else if (type === 'intercompany') {
      operationType = sum < 0 ? 'withdrawal' : 'deposit';
      sum = Math.abs(sum);
    } else {
      throw new Error(`Unknown cash flow operation type ${type}`);
    }

    const date = parseDate(item.pay_d);
    const currency = parseCurrency(item.currency);

    operations.push({
      id: item.id,
      type: operationType,
      date,
      sum,
      currency,
    });
  });

  return operations;
};

const parseDividends = (list: any[]) => {
  const operations: FreedomDividendOperation[] = [];

  list.forEach(item => {
    const type = item.type;

    if (['bank', 'intercompany'].includes(type)) {
      return;
    }

    const sum = parseFloat(item.amount);
    const ticker = parseTicker(item.ticker);
    const currency = parseCurrency(item.currency);
    const date = parseDate(item.pay_d);

    if (!['dividend', 'dividend_reverted', 'tax', 'tax_reverted'].includes(type)) {
      throw new Error(`Unknown dividend operation type ${type}`);
    }

    // TODO: comment for reverted

    operations.push({
      id: item.id,
      type: 'dividend',
      date,
      ticker,
      currency,
      sum,
    });
  });

  return operations;
};

export const parseData = async (content: string) => {
  const data = JSON.parse(content);

  const tradeOperations = parseTrades(data.trades.detailed);
  const cashOperations = parseCashOperations(data.cash_in_outs);
  const dividends = parseDividends(data.cash_in_outs);

  const operations: FreedomOperation[] = [...tradeOperations, ...cashOperations, ...dividends];

  return operations;
};
