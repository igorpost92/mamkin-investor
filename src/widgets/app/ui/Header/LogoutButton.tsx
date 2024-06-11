'use client';

import React from 'react';
import { Button } from '@mantine/core';
import { logOut } from '../../../../actions/auth';

const LogoutButton: React.FC = () => {
  return (
    <Button variant={'subtle'} onClick={() => logOut()}>
      Logout
    </Button>
  );
};

export default LogoutButton;
