import React from 'react';
import { getAssets } from '../../shared/api/mainApi/assets';
import AssetsList from './ui/AssetsList';

const Assets: React.FC = async () => {
  const data = await getAssets();

  return <AssetsList data={data} />;
};

export default Assets;
