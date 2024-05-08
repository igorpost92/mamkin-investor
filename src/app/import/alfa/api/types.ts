export type Currency = 'RUB' | 'USD';

export type AlfaOperation = TradingOperation | CashOperation;

export interface TradingOperation {
  type: 'purchase' | 'sell';
  id: string;
  date: Date;
  asset: string;
  isin: string;
  currency: Currency;
  price: number;
  quantity: number;
  sum: number;
}

export interface CashOperation {
  type: 'deposit' | 'withdraw';
  date: Date;
  sum: number;
  currency: Currency;
}
