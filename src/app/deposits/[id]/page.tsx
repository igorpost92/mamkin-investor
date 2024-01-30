import React from 'react';
import DepositDocument from '../ui/DepositDocument';

interface Props {
  params: { id: string };
}

const DepositPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <DepositDocument id={id} />;
};

export default DepositPage;
