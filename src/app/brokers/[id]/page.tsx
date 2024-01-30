import React from 'react';
import BrokerDocument from '../ui/BrokerDocument';

interface Props {
  params: { id: string };
}

const BrokerPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <BrokerDocument id={id} />;
};

export default BrokerPage;
