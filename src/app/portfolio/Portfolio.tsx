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
    { name: 'weight', type: 'number', precision: 2 },
    { name: 'avgPrice', type: 'number', width: 300, precision: 2 },
    { name: 'quantity', type: 'number', width: 300 },
    { name: 'currency', type: 'object', getPresentation: data => data.asset.currency },
    { name: 'amount', type: 'number', precision: 0 },
    { name: 'amountInRub', type: 'number', precision: 0, footer: true },
  ];

  return (
    <Table data={assets} columns={columns} initialSort={[{ field: 'weight', order: 'desc' }]} />
  );
};

export default Portfolio;
