import React from 'react';
import { getDividends } from '../../shared/api';
import DividendsList from './ui/DividendsList';

const Dividends: React.FC = async () => {
  const data = await getDividends();

  return <DividendsList data={data} />;
};

export default Dividends;
