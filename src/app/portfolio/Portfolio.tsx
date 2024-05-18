'use client';

import React, { useState } from 'react';
import { Table, TableColumn } from '../../shared/ui';
import { Position } from './page';
import { Select } from '@mantine/core';
import { uniqBy } from 'lodash';

interface Props {
  data: Position[];
}

// TODO: filter by broker

const Portfolio: React.FC<Props> = props => {
  const [currency, setCurrency] = useState<string | null>(null);

  const currencyOptions = uniqBy(props.data, item => item.asset.currency).map(item => ({
    value: item.asset.currency!,
    label: item.asset.currency!,
  }));

  const assets = currency
    ? props.data.filter(item => item.asset.currency === currency)
    : props.data;

  const columns: TableColumn<Position>[] = [
    { name: 'asset', type: 'object', getPresentation: data => data.asset.name },
    { name: 'currency', type: 'object', width: 110, getPresentation: data => data.asset.currency },
    { name: 'weight', type: 'number', width: 100, precision: 2 },
    { name: 'avgPrice', title: 'Avg.price', type: 'number', width: 150, precision: 2 },
    { name: 'price', type: 'number', width: 150, precision: 2 },
    { name: 'priceDelta', title: 'Price (%)', type: 'number', width: 150, precision: 2 },
    { name: 'quantity', type: 'number', width: 150 },
    {
      name: 'amount',
      type: 'number',
      width: 150,
      precision: 0,
      footer: !!currency,
    },
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
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 200 }}>
          <Select
            label={'Currency'}
            searchable
            clearable
            value={currency}
            onChange={setCurrency}
            data={currencyOptions}
          />
        </div>
      </div>
      <br />
      <Table
        data={assets}
        columns={columns}
        initialSort={[{ field: 'weight', order: 'desc' }]}
        highlightRowOnHover
      />
    </>
  );
};

export default Portfolio;
