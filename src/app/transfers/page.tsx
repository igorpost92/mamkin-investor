import React from 'react';
import TransfersList from './ui/TransfersList';
import { getTransfers } from '../../shared/api/mainApi/transfers';

const Transfers: React.FC = async () => {
  const data = await getTransfers();

  return <TransfersList data={data} />;
};

export default Transfers;
