import React from 'react';
import { Group } from '@mantine/core';
import Finam from './finam';
import Tinkoff from './tinkoff';
import Alfa from './alfa';
import Freedom from './freedom';

const ImportPage: React.FC = () => {
  return (
    <Group align={'flex-start'}>
      <Finam />
      <Tinkoff />
      <Alfa />
      <Freedom />
    </Group>
  );
};

export default ImportPage;
