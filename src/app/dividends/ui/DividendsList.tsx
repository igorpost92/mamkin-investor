'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Asset, Broker, Dividend } from '../../../shared/db/schema';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

type TableDataItem = Dividend & {
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
  { name: 'sumRub', type: 'number', title: 'Sum (rub)' },
  { name: 'commission', type: 'number' },
  { name: 'brokerTransactionId' },
];

const DividendsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newDividend()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.dividend(data.id)}
    />
  );
};

export default DividendsList;
