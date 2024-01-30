'use client';

import React from 'react';
import { Button, useMantineColorScheme } from '@mantine/core';

const ThemeButton: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Button variant={'subtle'} onClick={toggleColorScheme}>
      {colorScheme === 'light' ? 'Day' : 'Night'}
    </Button>
  );
};

export default ThemeButton;
