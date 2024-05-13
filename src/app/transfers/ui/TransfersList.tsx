'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { appRoutes } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';
import { Transfer } from '../../../shared/db/entities/transfer';

interface Props {
  data: Transfer[];
}

const columns: TableColumn<Transfer>[] = [
  { name: 'date', type: 'date' },
  {
    name: 'brokerFrom',
    type: 'object',
    getId: data => data.brokerFrom.id,
    getPresentation: data => data.brokerFrom.name,
  },
  {
    name: 'brokerTo',
    type: 'object',
    getId: data => data.brokerTo.id,
    getPresentation: data => data.brokerTo.name,
  },
  {
    name: 'asset',
    type: 'object',
    getId: data => data.asset.id,
    getPresentation: data => data.asset.name,
  },
  { name: 'quantity', type: 'number' },
];

const TransfersList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newTransfer()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.transfer(data.id)}
    />
  );
};

export default TransfersList;
