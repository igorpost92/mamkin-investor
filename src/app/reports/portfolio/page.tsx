import React from 'react';
import Portfolio from './Portfolio';
import { getPortfolioData } from './getData';
import { Asset } from '../../../shared/db/entities';
import { getBrokers } from '../../../shared/api/mainApi/brokers';

export interface Position {
  asset: Asset;
  quantity: number;
  avgPrice: number;
  price?: number;
  priceDelta?: number;
  weight: number;
  amount: number;
  amountInRub: number;
}

const PortfolioPage: React.FC = async () => {
  const data = await getPortfolioData();
  const brokers = await getBrokers();

  return <Portfolio data={data} brokers={brokers} />;
};

export default PortfolioPage;
