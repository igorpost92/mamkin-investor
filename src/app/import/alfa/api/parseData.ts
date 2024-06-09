import xml2js from 'xml2js';
import { AlfaOperation } from './types';

const parseDate = (dateStr: string) => {
  const strWithTimezone = `${dateStr}+03:00`;
  return new Date(strWithTimezone);
};

const readTrades = (list: any[]) => {
  const operations: AlfaOperation[] = [];

  list.forEach(item => {
    const placeName = item.place_name[0];

    if (placeName !== 'МБ ФР') {
      if (['OTC НРД'].includes(placeName)) {
        return;
      }

      throw new Error(`unknown place name: ${placeName}`);
    }

    const quantity = Number(item.qty[0]);

    operations.push({
      type: quantity > 0 ? 'purchase' : 'sell',
      id: item.trade_no[0],
      date: parseDate(item.db_time[0]),
      isin: item.isin_reg[0],
      asset: item.p_name[0],
      currency: item.curr_calc[0],
      price: item.Price[0],
      quantity: Math.abs(quantity),
      sum: item.summ_trade[0],
    });
  });

  return operations;
};

const readMoneyMoves = (list: any[]) => {
  const operations: AlfaOperation[] = [];

  list.forEach(item => {
    if (item.oper_type[0] === 'Перевод' && item.comment[0] === 'из АО "Альфа-Банк"') {
      operations.push({
        type: 'deposit',
        date: parseDate(item.settlement_date[0]),
        sum: item.volume[0],
        currency: item.p_code[0],
      });
    }
  });

  return operations;
};

export const parseData = async (content: Buffer) => {
  const parser = new xml2js.Parser();

  const fileData = content.toString();
  const dataObject: any = await parser.parseStringPromise(fileData);

  const tradesList = [
    ...dataObject.report_broker.trades_finished[0].trade,
    ...dataObject.report_broker.trades_unfinished[0].trade,
  ];

  const tradeOperations = readTrades(tradesList);
  const cashOperations = readMoneyMoves(dataObject.report_broker.money_moves[0].money_move);

  const operations = [...tradeOperations, ...cashOperations];

  return operations;
};
