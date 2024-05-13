'use client';

import React from 'react';
import { TableColumn } from '../../../shared/ui';
import { Broker } from '../../../shared/db/entities';
import { DocumentsListTemplate } from '../../../widgets/document';
import { appRoutes } from '../../../shared/constants';

interface Props {
  data: Broker[];
}

const columns: TableColumn[] = [{ name: 'name' }];

const BrokersList: React.FC<Props> = props => {
  return (
    <DocumentsListTemplate
      newDocumentLink={appRoutes.newBroker()}
      columns={columns}
      data={props.data}
      initialSort={[{ field: 'name', order: 'asc' }]}
      rowUrl={data => appRoutes.broker(data.id)}
    />
  );
};

export default BrokersList;
