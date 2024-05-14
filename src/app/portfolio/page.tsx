import React from 'react';
import Portfolio from './Portfolio';
import { getPortfolioData } from './getData';
import { Asset } from '../../shared/db/entities';

export interface Position {
  asset: Asset;
  quantity: number;
  avgPrice: number;
  price?: number;
  weight: number;
  amount: number;
  amountInRub: number;
}

const PortfolioPage: React.FC = async () => {
  const data = await getPortfolioData();

  return <Portfolio data={data} />;
};

export default PortfolioPage;
