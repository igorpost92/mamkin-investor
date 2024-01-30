'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { appRoutes, routeWithRedirect } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';
import { TradingJournalDatum } from '../config/types';

interface Props {
  data: TradingJournalDatum[];
}

const columns: TableColumn<TradingJournalDatum>[] = [
  { name: 'date', type: 'date' },
  { name: 'operation' },
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
  { name: 'quantity', type: 'number', footer: true },
];

const TradingJournalTable: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => {
        const method = appRoutes[data.operation];
        const from = appRoutes.tradingJournal;
        const url = routeWithRedirect(method(data.id), from);
        return url;
      }}
    />
  );
};

export default TradingJournalTable;
