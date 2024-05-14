'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { syncAssets } from './api/syncAssets';
import { syncOperations } from './api/syncOperations';

const Tinkoff = () => {
  return (
    <Stack>
      <h4>Tinkoff</h4>
      <Button onClick={() => syncOperations()}>import operations</Button>
      <Button onClick={() => syncAssets()}>sync assets</Button>
    </Stack>
  );
};

export default Tinkoff;
