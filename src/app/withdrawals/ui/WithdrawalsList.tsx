'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Broker, Withdrawal } from '../../../shared/db/schema';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

type TableDataItem = Withdrawal & {
  broker: Broker;
};

interface Props {
  data: TableDataItem[];
}

const columns: TableColumn<TableDataItem>[] = [
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
