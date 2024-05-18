'use client';

import React from 'react';
import { Button, Stack } from '@mantine/core';
import { importFromAlfa } from './importFromAlfa';

const Alfa = () => {
  return (
    <form action={importFromAlfa}>
      <Stack align={'flex-start'}>
        <input required name={'file'} type="file" accept={'.xml'} />
        <Button type={'submit'}>import</Button>
      </Stack>
    </form>
  );
};

export default Alfa;
