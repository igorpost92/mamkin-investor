'use client';

import React from 'react';
import { Table, TableColumn } from '../../shared/ui';
import { Position } from './page';

interface Props {
  data: Position[];
}

const Portfolio: React.FC<Props> = props => {
  const assets = props.data;

  const columns: TableColumn<Position>[] = [
    { name: 'asset', type: 'object', getPresentation: data => data.asset.name },
    { name: 'currency', type: 'object', width: 110, getPresentation: data => data.asset.currency },
    { name: 'weight', type: 'number', width: 100, precision: 2 },
    { name: 'avgPrice', title: 'Avg.price', type: 'number', width: 150, precision: 2 },
    { name: 'price', type: 'number', width: 150, precision: 2 },
    { name: 'priceDelta', title: 'Price (%)', type: 'number', width: 150, precision: 2 },
    { name: 'quantity', type: 'number', width: 150 },
    { name: 'amount', type: 'number', width: 150, precision: 0 },
    {
      name: 'amountInRub',
      title: 'Amount (RUB)',
      type: 'number',
      width: 150,
      precision: 0,
      footer: true,
    },
  ];

  return (
    <Table data={assets} columns={columns} initialSort={[{ field: 'weight', order: 'desc' }]} />
  );
};

export default Portfolio;
