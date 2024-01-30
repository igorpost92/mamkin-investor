'use client';

import React from 'react';
import { DocumentFieldConfig } from '../../../../types';
import { usePromiseOnMount } from '../../../../../../shared/hooks';
import { Select } from '@mantine/core';

interface Props {
  config: DocumentFieldConfig;
  id?: string;
  name?: string;
  value: string | null;
  onChange: (value: string | null) => void;

  // TODO: onFocus
  // TODO: onBlur
  // TODO: ref
}

const SelectField: React.FC<Props> = props => {
  if (props.config.type !== 'object') {
    throw new Error('aa');
  }

  const config = props.config;

  const optionsRequest = usePromiseOnMount(props.config.getOptions);

  const options = optionsRequest.data?.map(item => ({
    value: config.getId(item),
    label: config.getPresentation(item),
  }));

  return (
    <Select searchable clearable value={props.value} onChange={props.onChange} data={options} />
  );
};

export default SelectField;
