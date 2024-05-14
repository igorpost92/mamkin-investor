export type Currency = 'RUB' | 'USD';

export type FinamOperation = CashOperation | DividendOperation | TradingOperation;

export interface TradingOperation {
  type: 'purchase' | 'sell';
  id: string;
  date: Date;
  asset: string;
  isin: string;
  currency: Currency;
  qty: number;
  sum: number;
  nkd?: number;
}

export interface CashOperation {
  type: 'deposit' | 'withdrawal';
  date: Date;
  sum: number;
  currency: Currency;
}

export interface DividendOperation {
  type: 'dividend';
  isin: string;
  date: Date;
  currency: Currency;
  sum: number;
  sumRub: number;
}
