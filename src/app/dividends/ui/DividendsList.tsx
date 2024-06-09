'use client';

import React from 'react';
import { TableColumn } from 'mobile-kit/components/Table';
import { Dividend } from '../../../shared/db/entities';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

interface Props {
  data: Dividend[];
}

const columns: TableColumn<Dividend>[] = [
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
