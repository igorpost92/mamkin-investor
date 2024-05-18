'use client';

import React, { useState } from 'react';
import { Table, TableColumn } from '../../../shared/ui';
import { Position } from '../portfolio/page';
import { Select, Switch } from '@mantine/core';
import { groupBy, orderBy, sumBy, uniqBy } from 'lodash';

interface Props {
  // TODO: types
  data: any[];
}

// assetId: string;
// brokerId: string;
// quantity: string;
// buyDate: Date;
// buyPrice: string;
// sellDate?: Date | null;
// sellPrice?: string | null;
// type: 'buy' | 'sell' | 'split' | 'transfer';

// TODO:
// group by asset
// show broker
// filter by dates
// amount in rub - calc rate of sell date. maybe buy date also

const SellsStats: React.FC<Props> = props => {
  // TODO: refacto

  const [asset, setAsset] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [groupByAsset, setGroupByAsset] = useState(true);

  const assetOptions = orderBy(
    uniqBy(props.data, item => item.asset.id).map(item => ({
      value: item.asset.id!,
      label: item.asset.name!,
    })),
    item => item.label,
  );

  const currencyOptions = uniqBy(props.data, item => item.asset.currency).map(item => ({
    value: item.asset.currency!,
    label: item.asset.currency!,
  }));

  let { data } = props;

  if (asset) {
    data = data.filter(item => item.asset.id === asset);
  }

  if (currency) {
    data = data.filter(item => item.asset.currency === currency);
  }

  if (groupByAsset) {
    // TODO: move to back
    const groupedData = groupBy(data, item => item.asset.id);
    data = Object.values(groupedData).map(items => {
      const asset = items[0].asset;

      const quantity = sumBy(items, item => item.quantity);

      const buySum = sumBy(items, item => item.quantity * item.buyPrice);
      const buyPrice = buySum / quantity;

      const sellSum = sumBy(items, item => item.quantity * item.sellPrice);
      const sellPrice = sellSum / quantity;

      return {
        asset,
        quantity,
        buyPrice,
        sellPrice,
        delta: sellSum - buySum,
      };
    });
  }

  console.log('bb', data);

  const columns: TableColumn<Position>[] = [
    { name: 'asset', type: 'object', getPresentation: data => data.asset.name },
    { name: 'currency', type: 'object', width: 110, getPresentation: data => data.asset.currency },
    { name: 'buyDate', type: 'date', dateFormat: 'datetime', width: 120 },
    { name: 'quantity', type: 'number', width: 120 },
    { name: 'buyPrice', type: 'number', width: 120, precision: 0 },
    { name: 'sellPrice', type: 'number', width: 120, precision: 0 },
    { name: 'delta', type: 'number', width: 120, precision: 0, footer: true },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 200 }}>
          <Select
            label={'Asset'}
            searchable
            clearable
            value={asset}
            onChange={setAsset}
            data={assetOptions}
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

        <div>
          <Switch
            checked={groupByAsset}
            onChange={e => setGroupByAsset(e.currentTarget.checked)}
            label="Group by asset"
          />
        </div>
      </div>
      <br />
      <Table
        data={data}
        columns={columns}
        initialSort={[{ field: 'buyDate', order: 'desc' }]}
        highlightRowOnHover
      />
    </>
  );
};

export default SellsStats;
