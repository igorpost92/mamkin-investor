'use client';

import React from 'react';
import { getSell, createSell, updateSell, deleteSell } from '../../../shared/api/mainApi/sells';
import { getBrokers } from '../../../shared/api/mainApi/brokers';
import { getAssets } from '../../../shared/api/mainApi/assets';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  { name: 'date', type: 'date', required: true },
  {
    name: 'brokerId',
    type: 'object',
    title: 'Broker',
    getOptions: getBrokers,
    getId: data => data.id,
    getPresentation: data => data.name,
    required: true,
  },
  {
    name: 'assetId',
    type: 'object',
    title: 'Asset',
    getOptions: getAssets,
    getId: data => data.id,
    getPresentation: data => data.name,
    required: true,
  },
  { name: 'currency', required: true },
  { name: 'sum', type: 'number', required: true },
  { name: 'price', type: 'number', required: true },
  { name: 'quantity', type: 'number', required: true },
  { name: 'commission', type: 'number' },
  { name: 'brokerTransactionId' },
];

interface Props {
  id?: string;
}

const SellDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.sells}
      id={id}
      fields={fields}
      crud={{
        get: getSell,
        create: createSell,
        update: updateSell,
        delete: deleteSell,
      }}
    />
  );
};

export default SellDocument;
