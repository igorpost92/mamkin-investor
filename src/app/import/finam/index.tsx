import React from 'react';
import { importFromFinam } from './finamImport';
import { Button, Stack } from '@mantine/core';

const Finam: React.FC = () => {
  return (
    <form action={importFromFinam}>
      <Stack align={'flex-start'}>
        <input required name={'file'} type="file" accept={'.xml'} />
        <Button type={'submit'}>import</Button>
      </Stack>
    </form>
  );
};

export default Finam;
