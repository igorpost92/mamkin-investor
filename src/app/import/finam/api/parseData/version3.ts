import { endOfDay } from 'date-fns';
import {
  CashOperation,
  Currency,
  FinamOperation,
  DividendOperation,
  TradingOperation,
} from '../types';
import { orderBy } from 'lodash';

const parseDatetime = (dayString: string, time: string) => {
  const [day, month, year] = dayString.split('.');
  return new Date(`${year}-${month}-${day}T${time}+0300`);
};

const parseDay = (dayString: string) => {
  return parseDatetime(dayString, '00:00:00');
};

const parseCurrency = (rawData: string): Currency => {
  if (rawData === 'Рубль') {
    return 'RUB';
  }

  if (rawData === 'Доллар США') {
    return 'USD';
  }

  throw new Error(`Unknown currency ${rawData}`);
};

const isinFallback = (rawData: string) => {
  const titlesMap = {
    'ММК ПАО': 'RU0009084396',
    'Газпром нефть ПАО': 'RU0009062467',
    'Сбербанк ПАО': 'RU0009029557',
    'Татнефть ПАО': 'RU0006944147',
    'ЛУКОЙЛ НК ПАО': 'RU0009024277',
    'ГАЗПРОМ ПАО': 'RU0007661625',
    'Роснефть НК ПАО': 'RU000A0J2Q06',
    'Северсталь ПАО': 'RU0009046510',
    'Норильский никель ГМК ПАО': 'RU0007288411',
    'НЛМК ПАО': 'RU0009046452',
    'НОВАТЭК ПАО': 'RU000A0DKVS5',
    'Распадская ПАО': 'RU000A0B90N8',
    'Возмещение доходов по акциям  "ММВБ"': 'RU000A0JR4A1',
    'МинФин России, Обл, 012': 'RU000A0JX0H6',
    'Apple Inc.': 'US0378331005',
    Microsoft: 'US5949181045',
    'MasterCard Incorporated': 'US57636Q1040',
    USDRUB_TOM: 'USD000UTSTOM',
    USDRUB_TOD: 'USD000UTSTOM',
  };

  const isin = Object.entries(titlesMap).find(([title]) => rawData.includes(title))?.[1];
  return isin;
};

const parseISIN = (rawData: string) => {
  const isinRE = /[A-Z]{2}[A-Z0-9]{10}/g;
  const res = isinRE.exec(rawData);

  if (res) {
    const isin = res[0];

    if (isin === 'US87238U2033') {
      // tinkoff
      return 'RU000A107UL4';
    }

    return isin;
  }

  const fallbackRes = isinFallback(rawData);
  if (fallbackRes) {
    return fallbackRes;
  }

  throw new Error(`Can't parse isin from: ${rawData}`);
};

const isDividendOperation = (operation: string, comment: string) => {
  if (['Дивиденды', 'НКД'].includes(operation)) {
    return true;
  }

  if (operation === 'Зачисление ДС') {
    return (
      /^Возмещение доход(ов|а)/.test(comment) ||
      comment.startsWith('Доход по депозитарным распискам по ')
    );
  }

  return false;
};

const parseNonTradingOperations = (sections: any) => {
  const nonTradingSection = sections.DB7['0'];
  if (nonTradingSection.$.Name !== 'Неторговые операции с денежными средствами') {
    throw new Error('wrong name DB7');
  }

  const operations: any[] | undefined = nonTradingSection.R;
  if (!operations?.length) {
    return [];
  }

  const ops: FinamOperation[] = [];

  operations.forEach(({ $: item }: any) => {
    if (item.Grouping === '1') {
      return;
    }

    if (item.Op === 'Ввод ДС') {
      const op: CashOperation = {
        type: 'deposit',
        date: parseDay(item.D),
        sum: Number(item.Rub),
        currency: parseCurrency(item.Cur),
      };

      ops.push(op);
      return;
    }

    if (item.Op === 'Вывод ДС') {
      const op: CashOperation = {
        type: 'withdrawal',
        date: parseDay(item.D),
        sum: Math.abs(Number(item.Rub)),
        currency: parseCurrency(item.Cur),
      };

      ops.push(op);
      return;
    }

    if (isDividendOperation(item.Op, item.C)) {
      // TODO: to fn and use for mmvb
      // already?

      const isin = parseISIN(item.C);

      const op: DividendOperation = {
        type: 'dividend',
        isin,
        date: parseDay(item.D),
        currency: parseCurrency(item.Cur),
        sum: Number(item.Inc),
        sumRub: Number(item.Rub),
      };

      ops.push(op);
      return;
    }

    if (
      [
        'Зачисление ДС', // TODO: ммвб
        'Списание ДС',
        'Комиссия брокерская',
        'Комиссия депозитария',
        'Перевод ДС',
        'Пеня',
        'НДФЛ',
        'Услуги сторонних организаций',
      ].includes(item.Op)
    ) {
      // todo
      // console.log('skipped:', item.Op, ':', item.C);
      return;
    }

    throw new Error(`Unknown operation type ${item.Op}`);
  });

  return ops;
};

const parseTradingOperations = (sections: any) => {
  const tradingSection = sections.DB9['0'];
  if (
    ![
      'Торговые движения ценных бумаг и иностранных финансовых инструментов, не квалифицированных в качестве ценных бумаг (включая незавершенные сделки), в т.ч. Комиссии',
      'Торговые движения ценных бумаг (включая незавершенные сделки), в т.ч. Комиссии',
    ].includes(tradingSection.$.Name)
  ) {
    throw new Error('wrong name DB9');
  }

  const tradingOperations: any[] | undefined = tradingSection.R;
  if (!tradingOperations?.length) {
    return [];
  }

  const ops: TradingOperation[] = [];

  tradingOperations.forEach(({ $: item }: any) => {
    if (item.Op === 'Покупка' || item.Op === 'Продажа') {
      const isPurchase = item.Op === 'Покупка';

      const id = item.RqNo;

      // TODO: big js or own
      const qty = Number(item.Qty);
      const price = Number(item.Pr);

      const sum = qty * price;

      const existingItem = ops.find(op => op.id === id);
      if (existingItem) {
        existingItem.qty += qty;
        existingItem.sum += sum;
        return;
      }

      let nkd;
      if (item.ACY) {
        nkd = Number(item.ACY);
        if (isPurchase) {
          nkd = -nkd;
        }
      }

      const dataItem: TradingOperation = {
        id,
        type: isPurchase ? 'purchase' : 'sell',
        date: parseDatetime(item.D, item.T),
        asset: item.IS ?? item.I,
        isin: parseISIN(item.ISIN),
        currency: parseCurrency(item.Cur),
        qty,
        sum,
        nkd,
      };

      ops.push(dataItem);
    } else if (item.Op === 'Комиссия брокерская') {
      // TODO:
      // const currency: Currency = item.CurF;
      // currentDay.data[currency].commission += Number(item.Fee);
    } else {
      throw new Error(`unknown operation type ${item.Op}`);
    }
  });

  return ops;
};

const parseCurrencyOperations = (sections: any) => {
  const currencySection = sections.DB11['0'];
  if (
    currencySection.$.Name !==
    'Торговые движения валют (включая незавершенные сделки), в т.ч. Комиссии'
  ) {
    throw new Error('wrong name DB11');
  }

  const currencyOperations: any[] | undefined = currencySection.R;
  if (!currencyOperations?.length) {
    return [];
  }

  const ops: TradingOperation[] = [];

  currencyOperations.forEach(({ $: item }: any) => {
    if (item.Type === 'Вознаграждение Компании') {
      return;
    }

    if (!['Покупка', 'Продажа'].includes(item.Type)) {
      throw new Error(`unknown operation type ${item.Type}`);
    }

    const id = item.RqNo;

    if (item.CurQ !== item.CurF) {
      throw new Error('different currencies');
    }

    ops.push({
      id,
      type: item.Type === 'Покупка' ? 'purchase' : 'sell',
      date: parseDatetime(item.D, item.T),
      asset: item.I,
      isin: parseISIN(item.I),
      currency: parseCurrency(item.CurQ),
      qty: Number(item.Qty),
      sum: Number(item.Vol),
    });
  });

  return ops;
};

export const parseVersion3 = (data: any) => {
  const sections = data.REPORT_DOC.SECTIONS[0];

  const nonTradingOperations = parseNonTradingOperations(sections);
  const tradingOperations = parseTradingOperations(sections);
  const currencyOperations = parseCurrencyOperations(sections);

  const operations = orderBy(
    [...nonTradingOperations, ...tradingOperations, ...currencyOperations],
    item => item.date,
  );

  const begin = parseDay(data.REPORT_DOC.DOC_REQUISITES[0].$.DateBegin);
  const end = endOfDay(parseDay(data.REPORT_DOC.DOC_REQUISITES[0].$.DateEnd));
  const wrongOperations = operations.filter(item => item.date < begin || item.date > end);
  if (wrongOperations.length) {
    throw new Error(`found operations outside the report dates scope - ${wrongOperations.length}`);
  }

  return operations;
};
