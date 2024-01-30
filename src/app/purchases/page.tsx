import React from 'react';
import PurchasesList from './ui/PurchasesList';
import { getPurchases } from '../../shared/api';

const Purchases: React.FC = async () => {
  const data = await getPurchases();

  return <PurchasesList data={data} />;
};

export default Purchases;
