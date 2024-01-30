'use client';

import React from 'react';
import { DocumentFieldConfig } from '../../types';
import { regularCase } from '../../../../shared/lib/utils/regularCase';
import { Controller, useFormContext } from 'react-hook-form';
import { DateInput, FormControl } from '../../../../shared/ui';
import SelectField from './ui/SelectField/SelectField';
import { NumberInput, TextInput } from '@mantine/core';

interface Props {
  config: DocumentFieldConfig;
}

export const DocumentField: React.FC<Props> = props => {
  const form = useFormContext();

  const { config } = props;

  const content = (
    <Controller
      name={config.name}
      control={form.control}
      rules={{
        required: config.required,
      }}
      render={({ field: { ref, ...fieldProps } }) => {
        if (config.type === 'number') {
          return (
            <NumberInput
              {...fieldProps}
              autoComplete={'off'}
              value={fieldProps.value ?? ''}
              id={fieldProps.name}
              ref={ref}
            />
          );
        }

        if (config.type === 'date') {
          return (
            // TODO: ref & rest
            <DateInput
              {...fieldProps}
              dateFormat={config.dateFormat === 'date' ? 'date' : 'datetime'}
              id={fieldProps.name}
            />
          );
        }

        if (config.type === 'object') {
          // TODO: ref & rest
          return <SelectField {...fieldProps} config={config} />;
        }

        if (!config.type || config.type === 'string') {
          return (
            <TextInput
              {...fieldProps}
              autoComplete={'off'}
              id={fieldProps.name}
              value={fieldProps.value ?? ''}
              ref={ref}
            />
          );
        }

        // TODO: boolean

        // TODO:
        return <div>NOT READY: {config.type}</div>;
      }}
    />
  );

  const title = config.title || regularCase(config.name);

  let errorMessage: string | undefined;

  const error = form.formState.errors[config.name];
  if (error) {
    if (error.type === 'required') {
      errorMessage = 'Required';
    } else {
      errorMessage = 'Unknown error';
    }
  }

  return (
    <FormControl id={config.name} label={title} error={errorMessage}>
      {content}
    </FormControl>
  );
};
