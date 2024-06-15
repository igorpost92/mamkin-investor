import React from 'react';
import { getWithdrawals } from '../../shared/api/mainApi/withdrawals';
import WithdrawalsList from './ui/WithdrawalsList';

const Withdrawals: React.FC = async () => {
  const data = await getWithdrawals();

  return <WithdrawalsList data={data} />;
};

export default Withdrawals;
