'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Asset } from '../../../shared/db/schema';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

interface Props {
  data: Asset[];
}

const columns: TableColumn[] = [
  { name: 'name' },
  { name: 'ticker', width: 100 },
  { name: 'isin', title: 'ISIN', width: 160 },
  { name: 'currency', width: 120 },
  { name: 'type', width: 90 },
  { name: 'uid', title: 'uid' },
];

const AssetsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newAsset()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'name', order: 'asc' }]}
      rowUrl={data => appRoutes.asset(data.id)}
    />
  );
};

export default AssetsList;
