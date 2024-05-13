import React from 'react';
import { importFromFinam } from './finamImport';
import { Button, Stack } from '@mantine/core';

const Finam: React.FC = () => {
  return (
    <Stack>
      <h4>Finam</h4>
      <form action={importFromFinam}>
        <Stack>
          <input required name={'file'} type="file" accept={'.xml'} />
          <Button type={'submit'}>import from finam</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default Finam;
