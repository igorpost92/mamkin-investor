'use client';

import React from 'react';
import DocumentForm from '../DocumentForm/DocumentForm';
import { Button, Group, Space } from '@mantine/core';

interface Props {
  isNew: boolean;
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
  children: React.ReactNode;
}

export const DocumentView: React.FC<Props> = props => {
  // TODO: pending states

  return (
    <DocumentForm onSubmit={props.onSave} initialData={props.initialData}>
      <Group gap={'xs'}>
        <Button type={'submit'} variant={'outline'}>
          Save
        </Button>
        <Button variant={'outline'} color={'gray'} onClick={props.onClose}>
          Close
        </Button>
        {!props.isNew && (
          <Button variant={'outline'} color={'red'} onClick={props.onDelete}>
            Delete
          </Button>
        )}
      </Group>

      <Space h={'xl'} />

      {props.children}
    </DocumentForm>
  );
};
