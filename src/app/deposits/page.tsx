import React from 'react';
import { getDeposits } from '../../shared/api/mainApi/deposits';
import DepositsList from './ui/DepositsList';

const Deposits: React.FC = async () => {
  const data = await getDeposits();

  return <DepositsList data={data} />;
};

export default Deposits;
