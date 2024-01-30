import React from 'react';
import { getWithdrawals } from '../../shared/api';
import WithdrawalsList from './ui/WithdrawalsList';

const Withdrawals: React.FC = async () => {
  const data = await getWithdrawals();

  return <WithdrawalsList data={data} />;
};

export default Withdrawals;
