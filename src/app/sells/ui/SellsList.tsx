'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Asset, Broker, Sell } from '../../../shared/db/schema';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

type TableDataItem = Sell & {
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
  { name: 'sum', type: 'number' },
  { name: 'price', type: 'number' },
  { name: 'quantity', type: 'number' },
];

const SellsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newSell()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.sell(data.id)}
    />
  );
};

export default SellsList;
