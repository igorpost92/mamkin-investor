import { Asset, Broker } from '../../../shared/db/entities';

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
