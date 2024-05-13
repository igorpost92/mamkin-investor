'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Deposit } from '../../../shared/db/entities';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

interface Props {
  data: Deposit[];
}

const columns: TableColumn<Deposit>[] = [
  { name: 'date', type: 'date' },
  {
    name: 'broker',
    type: 'object',
    getId: data => data.broker.id,
    getPresentation: data => data.broker.name,
  },
  { name: 'currency' },
  { name: 'sum', type: 'number' },
  { name: 'brokerTransactionId' },
];

const DepositsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newDeposit()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.deposit(data.id)}
    />
  );
};

export default DepositsList;
