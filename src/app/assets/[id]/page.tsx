import React from 'react';
import AssetDocument from '../ui/AssetDocument';

interface Props {
  params: { id: string };
}

const AssetPage: React.FC<Props> = props => {
  const { id } = props.params;

  return <AssetDocument id={id} />;
};

export default AssetPage;
