'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Asset, Split } from '../../../shared/db/schema';
import { appRoutes } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';

type TableDataItem = Split & {
  asset: Asset;
};

interface Props {
  data: TableDataItem[];
}

const columns: TableColumn<TableDataItem>[] = [
  { name: 'date', type: 'date' },
  {
    name: 'asset',
    type: 'object',
    getId: data => data.asset.id,
    getPresentation: data => data.asset.name,
  },
  { name: 'ratio', type: 'number' },
];

const SplitsList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newSplit()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'date', order: 'desc' }]}
      rowUrl={data => appRoutes.split(data.id)}
    />
  );
};

export default SplitsList;
