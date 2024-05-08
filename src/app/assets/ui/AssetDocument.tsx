'use client';

import React from 'react';
import { getAsset, createAsset, updateAsset, deleteAsset } from '../../../shared/api';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  { name: 'name', required: true },
  { name: 'ticker', required: true },
  { name: 'isin', title: 'ISIN' },
  { name: 'currency' },
  { name: 'type' },
  { name: 'uid', title: 'uid' },
];

interface Props {
  id?: string;
}

const AssetDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.assets}
      id={id}
      fields={fields}
      crud={{
        get: getAsset,
        create: createAsset,
        update: updateAsset,
        delete: deleteAsset,
      }}
    />
  );
};

export default AssetDocument;