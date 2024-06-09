'use client';

import React from 'react';
import { TableColumn } from 'mobile-kit/components/Table';
import { Purchase } from '../../../shared/db/entities';
import { appRoutes } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';

interface Props {
  data: Purchase[];
}

const columns: TableColumn<Purchase>[] = [
  { name: 'date', type: 'date' },
  {
    name: 'broker',
    type: 'object',
    getId: data => data.broker.id,
    getPresentation: data => data.broker.name,
  },
  {
    name: 'asset',
    type: 'object',
    getId: data => data.asset.id,
    getPresentation: data => data.asset.name,
  },
  { name: 'currency' },
  { name: 'sum', type: 'number', footer: true },
  { name: 'price', type: 'number' },
  { name: 'quantity', type: 'number' },
  { name: 'commission', type: 'number' },
  { name: 'brokerTransactionId' },
];

const PurchasesList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newPurchase()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.purchase(data.id)}
    />
  );
};

export default PurchasesList;
