import React from 'react';
import PurchasesList from './ui/PurchasesList';
import { getPurchases } from '../../shared/api/mainApi/purchases';

const Purchases: React.FC = async () => {
  const data = await getPurchases();

  return <PurchasesList data={data} />;
};

export default Purchases;
