import React from 'react';
import TransferDocument from '../ui/TransferDocument';

interface Props {
  params: { id: string };
}

const TransferPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <TransferDocument id={id} />;
};

export default TransferPage;
