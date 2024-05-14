type Currency = string;

export type TinkoffOperation =
  | TradingOperation
  | CashOperation
  | DividendOperation
  | TransferOperation;

export interface AssetInfo {
  instrumentUid: string;
  assetUid: string;
  type: string;
  name: string;
}

export interface TradingOperation {
  type: 'purchase' | 'sell';
  id: string;
  date: Date;
  asset: AssetInfo;
  currency: Currency;
  qty: string;
  sum: string;
  // TODO:
  // commission: number
}

export interface CashOperation {
  type: 'deposit' | 'withdrawal';
  id: string;
  date: Date;
  sum: string;
  currency: Currency;
}

export interface DividendOperation {
  type: 'dividend';
  id: string;
  asset: AssetInfo;
  date: Date;
  currency: Currency;
  sum: number;
}

export interface TransferOperation {
  type: 'transfer';
  id: string;
  date: Date;
  asset: AssetInfo;
  qty: string;
}
