import React from 'react';
import { getSells } from '../../shared/api';
import SellsList from './ui/SellsList';

const Sells: React.FC = async () => {
  const data = await getSells();

  return <SellsList data={data} />;
};

export default Sells;
