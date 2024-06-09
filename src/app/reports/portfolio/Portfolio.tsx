'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableColumn } from 'mobile-kit/components/Table';
import { Position } from './page';
import { Select } from '@mantine/core';
import { uniqBy } from 'lodash';
import { Broker } from '../../../shared/db/entities';
import { usePromise } from '../../../shared/hooks';
import { getPortfolioData } from './getData';

interface Props {
  data: Position[];
  brokers: Broker[];
}

const Portfolio: React.FC<Props> = props => {
  const [currency, setCurrency] = useState<string | null>(null);
  const [brokerId, setBrokerId] = useState<string | null>(null);

  const currencyOptions = uniqBy(props.data, item => item.asset.currency).map(item => ({
    value: item.asset.currency!,
    label: item.asset.currency!,
  }));

  const brokersOptions = props.brokers.map(item => ({
    value: item.id,
    label: item.name,
  }));

  const request = usePromise(() =>
    getPortfolioData({
      brokerId: brokerId ?? undefined,
      currency: currency ?? undefined,
    }),
  );

  // TODO: useUpdateEffect
  useEffect(() => {
    if (!brokerId && !currency) {
      // TODO:
      // request.reset();
      return;
    }

    request.send();
  }, [brokerId, currency]);

  let data;

  if (brokerId || currency) {
    data = request.data ?? [];
  } else {
    data = props.data;
  }

  const columns: TableColumn<Position>[] = [
    { name: 'asset', type: 'object', getPresentation: data => data.asset.name },
    { name: 'currency', type: 'object', width: 110, getPresentation: data => data.asset.currency },
    { name: 'weight', title: 'Weight, %', type: 'number', width: 110, precision: 2 },
    { name: 'avgPrice', title: 'Avg.price', type: 'number', width: 120, precision: 2 },
    { name: 'price', type: 'number', width: 120, precision: 2 },
    { name: 'priceDelta', title: 'Price, %', type: 'number', width: 120, precision: 2 },
    { name: 'quantity', type: 'number', width: 120 },
    {
      name: 'amount',
      type: 'number',
      width: 120,
      precision: 0,
      footer: !!currency,
    },
    {
      name: 'amountInRub',
      title: 'Amount, RUB',
      type: 'number',
      width: 150,
      precision: 0,
      footer: true,
    },
    {
      name: 'amountInRubDelta',
      title: 'Amount, delta',
      type: 'number',
      width: 150,
      precision: 0,
      footer: true,
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 200 }}>
          <Select
            label={'Broker'}
            searchable
            clearable
            value={brokerId}
            onChange={setBrokerId}
            data={brokersOptions}
          />
        </div>
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

      {brokerId && request.isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Table
          data={data}
          columns={columns}
          initialSort={[{ field: 'weight', order: 'desc' }]}
          highlightRowOnHover
        />
      )}
    </>
  );
};

export default Portfolio;
