'use client';

import React from 'react';
import {
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
  getBrokers,
} from '../../../shared/api';
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
  { name: 'currency', required: true },
  { name: 'sum', required: true, type: 'number' },
  { name: 'brokerTransactionId' },
];

interface Props {
  id?: string;
}

const DepositDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.deposits}
      id={id}
      fields={fields}
      crud={{
        get: getDeposit,
        create: createDeposit,
        update: updateDeposit,
        delete: deleteDeposit,
      }}
    />
  );
};

export default DepositDocument;
