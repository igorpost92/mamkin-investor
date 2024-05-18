'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { syncAssets } from './api/syncAssets';
import { syncOperations } from './api/syncOperations';

const Tinkoff = () => {
  return (
    <Stack align={'flex-start'}>
      <Button onClick={() => syncOperations()}>import operations</Button>
      <Button onClick={() => syncAssets()}>sync assets</Button>
    </Stack>
  );
};

export default Tinkoff;
