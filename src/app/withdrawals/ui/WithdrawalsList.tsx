'use client';

import React from 'react';
import { TableColumn } from 'mobile-kit/components/Table';
import { Withdrawal } from '../../../shared/db/entities';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

interface Props {
  data: Withdrawal[];
}

const columns: TableColumn<Withdrawal>[] = [
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

const WithdrawalsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newWithdrawal()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.withdrawal(data.id)}
    />
  );
};

export default WithdrawalsList;
