'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { importFromFreedom } from './importFromFreedom';

const Alfa = () => {
  return (
    <Stack>
      <h4>Freedom KZ</h4>
      <form action={importFromFreedom}>
        <Stack>
          <input required name={'file'} type="file" accept={'.json'} />
          <Button type={'submit'}>import from freedom</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Alfa;
