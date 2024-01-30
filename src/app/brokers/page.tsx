import React from 'react';
import BrokersList from './ui/BrokersList';
import { getBrokers } from '../../shared/api';

const Brokers: React.FC = async () => {
  const data = await getBrokers();

  return <BrokersList data={data} />;
};

export default Brokers;
