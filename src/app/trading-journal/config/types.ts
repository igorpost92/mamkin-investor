import { Asset, Broker } from '../../../shared/db/schema';

export interface TradingJournalDatum {
  id: string;
  date: Date;
  operation: 'purchase' | 'sell';
  asset: Asset;
  broker: Broker;
  currency: string;
  price: string;
  quantity: string;
  sum: string;
}
