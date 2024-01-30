import React from 'react';
import DividendDocument from '../ui/DividendDocument';

interface Props {
  params: { id: string };
}

const DividendPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <DividendDocument id={id} />;
};

export default DividendPage;
