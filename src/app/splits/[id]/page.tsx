import React from 'react';
import SplitDocument from '../ui/SplitDocument';

interface Props {
  params: { id: string };
}

const SplitPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <SplitDocument id={id} />;
};

export default SplitPage;
