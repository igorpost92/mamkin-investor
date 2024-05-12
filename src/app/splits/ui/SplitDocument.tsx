'use client';

import React from 'react';
import { getSplit, createSplit, updateSplit, deleteSplit, getAssets } from '../../../shared/api';
import { DocumentFieldConfig } from '../../../entities/document';
import { DocumentTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

const fields: DocumentFieldConfig[] = [
  { name: 'date', required: true, type: 'date' },
  {
    name: 'assetId',
    required: true,
    title: 'Asset',
    type: 'object',
    getOptions: getAssets,
    getId: data => data.id,
    getPresentation: data => data.name,
  },
  { name: 'ratio', required: true, type: 'number' },
];

interface Props {
  id?: string;
}

const SplitDocument: React.FC<Props> = props => {
  const { id } = props;

  return (
    <DocumentTemplate
      redirectUrl={appRoutes.splits}
      id={id}
      fields={fields}
      crud={{
        get: getSplit,
        create: createSplit,
        update: updateSplit,
        delete: deleteSplit,
      }}
    />
  );
};

export default SplitDocument;
