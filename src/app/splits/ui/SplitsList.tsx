'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Split } from '../../../shared/db/entities';
import { appRoutes } from '../../../shared/constants';
import { DocumentsListTemplate } from '../../../widgets/document';

interface Props {
  data: Split[];
}

const columns: TableColumn<Split>[] = [
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
