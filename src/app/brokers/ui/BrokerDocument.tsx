'use client';

import React from 'react';
import { getBroker, createBroker, updateBroker, deleteBroker } from '../../../shared/api';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  {
    name: 'name',
    required: true,
  },
];

interface Props {
  id?: string;
}

const BrokerDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.brokers}
      id={id}
      fields={fields}
      crud={{
        get: getBroker,
        create: createBroker,
        update: updateBroker,
        delete: deleteBroker,
      }}
    />
  );
};

export default BrokerDocument;
