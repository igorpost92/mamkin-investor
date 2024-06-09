import React, { ComponentProps } from 'react';
import { useTableFilters } from '../../../../kit/components/TableFilters/hooks/useTableFilters';
import TableFilters from '../../../../kit/components/TableFilters/TableFilters';
import { Table, TableColumn } from 'mobile-kit/components/Table';
import Link from 'next/link';
import { Button, Group, Space } from '@mantine/core';

type TableProps<T> = ComponentProps<typeof Table<T>>;

interface Props<T> {
  newDocumentLink?: string;
  columns: TableColumn<T>[];
  data: T[];
  initialSort: TableProps<T>['initialSort'];
  rowUrl: TableProps<T>['rowUrl'];
}

export const DocumentsListTemplate = <T,>(props: Props<T>) => {
  const { columns } = props;
  const { filters, onFilterChange, data } = useTableFilters(columns, props.data);

  return (
    <>
      {props.newDocumentLink && (
        <>
          <Group>
            <Button variant={'outline'} component={Link} href={props.newDocumentLink}>
              New
            </Button>
          </Group>

          <Space h="md" />
        </>
      )}

      <TableFilters
        columns={columns}
        data={props.data}
        values={filters}
        onFilterChange={onFilterChange}
      />
      <Table data={data} columns={columns} initialSort={props.initialSort} rowUrl={props.rowUrl} />
    </>
  );
};
