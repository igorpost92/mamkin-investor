import React from 'react';
import SellDocument from '../ui/SellDocument';

interface Props {
  params: { id: string };
}

const SellPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <SellDocument id={id} />;
};

export default SellPage;
