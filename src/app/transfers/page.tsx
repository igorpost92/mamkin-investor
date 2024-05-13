import React from 'react';
import TransfersList from './ui/TransfersList';
import { getTransfers } from '../../shared/api';

const Transfers: React.FC = async () => {
  const data = await getTransfers();

  return <TransfersList data={data} />;
};

export default Transfers;
