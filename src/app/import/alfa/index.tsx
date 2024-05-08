'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { importFromAlfa } from './importFromAlfa';

const Alfa = () => {
  return (
    <Stack>
      <h4>Alfa</h4>
      <form action={importFromAlfa}>
        <Stack>
          <input required name={'file'} type="file" accept={'.xml'} />
          <Button type={'submit'}>import from alfa</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Alfa;
