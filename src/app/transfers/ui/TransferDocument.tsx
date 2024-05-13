'use client';

import React from 'react';
import {
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
  getBrokers,
  getAssets,
} from '../../../shared/api';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  { name: 'date', required: true, type: 'date' },
  {
    name: 'brokerFromId',
    required: true,
    title: 'Broker from',
    type: 'object',
    getOptions: getBrokers,
    getId: data => data.id,
    getPresentation: data => data.name,
  },
  {
    name: 'brokerToId',
    required: true,
    title: 'Broker from',
    type: 'object',
    getOptions: getBrokers,
    getId: data => data.id,
    getPresentation: data => data.name,
  },
  {
    name: 'assetId',
    required: true,
    title: 'Asset',
    type: 'object',
    getOptions: getAssets,
    getId: data => data.id,
    getPresentation: data => data.name,
  },
  { name: 'quantity', required: true, type: 'number' },
];

interface Props {
  id?: string;
}

const TransferDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.transfers}
      id={id}
      fields={fields}
      crud={{
        get: getTransfer,
        create: createTransfer,
        update: updateTransfer,
        delete: deleteTransfer,
      }}
    />
  );
};

export default TransferDocument;
