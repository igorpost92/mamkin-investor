import React from 'react';
import WithdrawalDocument from '../ui/WithdrawalDocument';

interface Props {
  params: { id: string };
}

const WithdrawalPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <WithdrawalDocument id={id} />;
};

export default WithdrawalPage;
