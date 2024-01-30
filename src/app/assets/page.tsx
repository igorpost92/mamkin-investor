import React from 'react';
import { getAssets } from '../../shared/api';
import AssetsList from './ui/AssetsList';

const Assets: React.FC = async () => {
  const data = await getAssets();

  return <AssetsList data={data} />;
};

export default Assets;
