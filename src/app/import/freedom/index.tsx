'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { importFromFreedom } from './importFromFreedom';

const Alfa = () => {
  return (
    <form action={importFromFreedom}>
      <Stack align={'flex-start'}>
        <input required name={'file'} type="file" accept={'.json'} />
        <Button type={'submit'}>import</Button>
      </Stack>
    </form>
  );
};

export default Alfa;
