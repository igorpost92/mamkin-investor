import React from 'react';
import SplitsList from './ui/SplitsList';
import { getSplits } from '../../shared/api/mainApi/splits';

const Splits: React.FC = async () => {
  const data = await getSplits();

  return <SplitsList data={data} />;
};

export default Splits;
