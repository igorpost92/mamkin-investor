'use client';

import React from 'react';
import { DocumentField, DocumentFieldConfig, DocumentView } from '../../../../entities/document';
import { usePromiseOnMount } from '../../../../shared/hooks';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Stack } from '@mantine/core';
import { QueryParams } from '../../../../shared/constants';

interface Props {
  id?: string;
  fields: DocumentFieldConfig[];
  redirectUrl: string;
  crud: {
    get: (id: string) => Promise<any | undefined>;
    // TODO: Promise<string> is no assignable to Promise<void>
    create: (data: any) => Promise<unknown>;
    update: (id: string, data: any) => Promise<unknown>;
    delete: (id: string) => Promise<void>;
  };
}

export const DocumentTemplate = (props: Props) => {
  const { id } = props;
  const isNew = !id;

  const { crud } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const request = usePromiseOnMount(async () => {
    if (!isNew) {
      return crud.get(id);
    }

    // TODO: default value in field
    const hasDateField = props.fields.some(field => field.name === 'date');

    if (hasDateField) {
      return { date: new Date() };
    }
  });

  if (request.isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isNew && !request.data) {
    // TODO:
    return notFound();
    return <div>No data</div>;
  }

  const initialData = request.data;

  const redirectBack = () => {
    const from = searchParams.get(QueryParams.From);

    if (from) {
      const decodedFrom = decodeURIComponent(from);
      router.push(decodedFrom);
      return;
    }

    router.push(props.redirectUrl);
  };

  const onSave = async (data: any) => {
    if (isNew) {
      await crud.create(data);
    } else {
      await crud.update(id, data);
    }

    redirectBack();
  };

  const onDelete = async () => {
    if (isNew) {
      return;
    }

    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    await crud.delete(id);
    redirectBack();
  };

  return (
    <DocumentView
      isNew={isNew}
      onClose={redirectBack}
      onSave={onSave}
      onDelete={onDelete}
      initialData={initialData}
    >
      <Stack style={{ width: 300 }}>
        {props.fields.map(field => (
          <DocumentField key={field.name} config={field} />
        ))}
      </Stack>
    </DocumentView>
  );
};
