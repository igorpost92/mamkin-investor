type Currency = string;

export type FreedomOperation = TradingOperation | CashOperation;

export interface FreedomAssetInfo {
  name: string;
  type: string;
  ticker: string;
  isin: string;
  currency?: string;
}

export interface TradingOperation {
  type: 'purchase' | 'sell';
  id: string;
  date: Date;
  asset: FreedomAssetInfo;
  currency: Currency;
  price: number;
  quantity: number;
  sum: number;
}

export interface CashOperation {
  // TODO: implement
  type: 'deposit' | 'withdrawal';
  date: Date;
  sum: number;
  currency: Currency;
}
