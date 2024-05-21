type Currency = string;

export type FreedomOperation =
  | FreedomTradingOperation
  | FreedomCashOperation
  | FreedomDividendOperation;

export interface FreedomAssetInfo {
  name: string;
  type: string;
  ticker: string;
  isin: string;
  currency?: string;
}

export interface FreedomTradingOperation {
  id: string;
  type: 'purchase' | 'sell';
  date: Date;
  asset: FreedomAssetInfo;
  currency: Currency;
  price: number;
  quantity: number;
  sum: number;
}

export interface FreedomCashOperation {
  id: string;
  type: 'deposit' | 'withdrawal';
  date: Date;
  sum: number;
  currency: Currency;
}

export interface FreedomDividendOperation {
  id: string;
  type: 'dividend';
  ticker: string;
  date: Date;
  currency: Currency;
  sum: number;
}
