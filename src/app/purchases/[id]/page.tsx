import React from 'react';
import PurchaseDocument from '../ui/PurchaseDocument';

interface Props {
  params: { id: string };
}

const PurchasePage: React.FC<Props> = props => {
  const { id } = props.params;

  return <PurchaseDocument id={id} />;
};

export default PurchasePage;
