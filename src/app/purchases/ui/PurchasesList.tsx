'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Asset, Broker, Purchase } from '../../../shared/db/schema';
import { appRoutes } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';

type TableDataItem = Purchase & {
  broker: Broker;
  asset: Asset;
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
