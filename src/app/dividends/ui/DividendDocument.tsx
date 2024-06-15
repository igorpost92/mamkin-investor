'use client';

import React from 'react';
import {
  getDividend,
  createDividend,
  updateDividend,
  deleteDividend,
} from '../../../shared/api/mainApi/dividends';
import { getBrokers } from '../../../shared/api/mainApi/brokers';
import { getAssets } from '../../../shared/api/mainApi/assets';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  { name: 'date', required: true, type: 'date' },
  {
    name: 'brokerId',
    required: true,
    title: 'Broker',
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
  { name: 'currency', required: true },
  { name: 'sum', required: true, type: 'number' },
  { name: 'sumRub', required: true, title: 'Sum (rub)', type: 'number' },
  { name: 'commission', type: 'number' },
  { name: 'brokerTransactionId' },
];

interface Props {
  id?: string;
}

const DividendDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.dividends}
      id={id}
      fields={fields}
      crud={{
        get: getDividend,
        create: createDividend,
        update: updateDividend,
        delete: deleteDividend,
      }}
    />
  );
};

export default DividendDocument;
