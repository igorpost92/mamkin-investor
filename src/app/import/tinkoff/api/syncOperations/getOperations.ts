import { tinkoffOpenApi } from '../../../../../shared/api/tinkoffOpenApi';
import {
  AssetInfo,
  CashOperation,
  DividendOperation,
  TinkoffOperation,
  TradingOperation,
  TransferOperation,
} from './types';
import { smartRound } from '../../../../../utils/smartRound';
import { parseTinkoffNumber } from '../../../../../shared/api/tinkoffOpenApi/utils';

export const getOperations = async () => {
  const operations = await tinkoffOpenApi.getOperationsListByAllAccounts();

  const ops: TinkoffOperation[] = [];

  for (const operation of operations) {
    if (
      [
        'OPERATION_TYPE_TAX',
        'OPERATION_TYPE_TAX_CORRECTION',
        'OPERATION_TYPE_BROKER_FEE',
        'OPERATION_TYPE_MARGIN_FEE',
        'OPERATION_TYPE_OVERNIGHT',
        'OPERATION_TYPE_SERVICE_FEE',
      ].includes(operation.type)
    ) {
      // TODO: later
      continue;
    }

    if (
      operation.type === 'OPERATION_TYPE_BUY_CARD' ||
      operation.type === 'OPERATION_TYPE_INPUT' ||
      operation.type === 'OPERATION_TYPE_OUTPUT'
    ) {
      const type = operation.type === 'OPERATION_TYPE_OUTPUT' ? 'withdrawal' : 'deposit';
      const sum = parseTinkoffNumber(operation.payment);
      const currency = operation.payment.currency.toUpperCase();

      const op: CashOperation = {
        id: operation.id,
        type,
        date: new Date(operation.date),
        currency,
        sum,
      };

      ops.push(op);

      if (operation.type !== 'OPERATION_TYPE_BUY_CARD') {
        continue;
      }
    }

    if (
      operation.type === 'OPERATION_TYPE_BUY' ||
      operation.type === 'OPERATION_TYPE_BUY_CARD' ||
      operation.type === 'OPERATION_TYPE_SELL'
    ) {
      const instrumentUid = operation.instrumentUid;

      const type = operation.type === 'OPERATION_TYPE_SELL' ? 'sell' : 'purchase';

      if (!operation.quantityDone) {
        throw new Error('No quantityDone');
      }

      const qty = operation.quantityDone;

      // TODO: vtb precision
      const price = parseTinkoffNumber(operation.price, 4);

      // TODO: big js
      const sum = smartRound(price * qty);

      const currency = operation.payment.currency.toUpperCase();

      const assetInfo: AssetInfo = {
        instrumentUid,
        assetUid: operation.assetUid,
        type: operation.instrumentType,
        name: operation.name,
      };

      const op: TradingOperation = {
        type,
        id: operation.id,
        date: new Date(operation.date),
        asset: assetInfo,
        currency,
        qty,
        sum,
      };

      ops.push(op);

      if (operation.instrumentType === 'bond') {
        // TODO: vtb precision
        let sum = smartRound(Number(parseTinkoffNumber(operation.accruedInt, 4)));

        if (type === 'purchase') {
          sum = -sum;
        }

        const currency = operation.accruedInt.currency.toUpperCase();

        const op: DividendOperation = {
          type: 'dividend',
          id: operation.id,
          date: new Date(operation.date),
          asset: assetInfo,
          currency,
          sum,
        };

        ops.push(op);
      }

      continue;
    }

    if (
      operation.type === 'OPERATION_TYPE_DIVIDEND' ||
      operation.type === 'OPERATION_TYPE_COUPON' ||
      operation.type === 'OPERATION_TYPE_DIVIDEND_TAX'
    ) {
      const instrumentUid = operation.instrumentUid;

      if (!instrumentUid) {
        throw new Error('no instrumentUid');
      }

      // TODO: vtb precision
      let sum = smartRound(Number(parseTinkoffNumber(operation.payment, 4)));

      if (operation.type === 'OPERATION_TYPE_DIVIDEND_TAX') {
        sum = -sum;
      }

      const currency = operation.payment.currency.toUpperCase();

      const op: DividendOperation = {
        type: 'dividend',
        id: operation.id,
        date: new Date(operation.date),
        asset: {
          instrumentUid,
          assetUid: operation.assetUid,
          type: operation.instrumentType,
          name: operation.name,
        },
        currency,
        sum,
      };

      ops.push(op);
      continue;
    }

    if (operation.type === 'OPERATION_TYPE_OUTPUT_SECURITIES') {
      const instrumentUid = operation.instrumentUid;

      if (!instrumentUid) {
        throw new Error('no instrumentUid');
      }

      const op: TransferOperation = {
        id: operation.id,
        type: 'transfer',
        date: new Date(operation.date),
        asset: {
          instrumentUid,
          assetUid: operation.assetUid,
          type: operation.instrumentType,
          name: operation.name,
        },
        qty: operation.quantityDone,
      };

      ops.push(op);
      continue;
    }

    throw new Error(`Unknown operation type: ${operation.type}`);
  }

  return ops;
};
