'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { signIn, signUp } from '../../actions/auth';
import { appRoutes } from '../../shared/constants';

type Mode = 'registration' | 'login';

interface Props {
  isRegistrationEnabled: boolean;
}

const LoginPage: React.FC<Props> = props => {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');

  const isRegistration = mode === 'registration';

  const changeMode = () => {
    setMode(isRegistration ? 'login' : 'registration');
  };

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const errors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async data => {
    try {
      if (isRegistration) {
        await signUp(data);
      } else {
        await signIn(data);
      }

      router.push(appRoutes.index);
    } catch (e) {
      let message;

      if (e instanceof Error) {
        message = e.message;
      }

      // TODO: check on prod

      alert(message ?? 'Error');
    }
  });

  const pageTitle = isRegistration ? 'Sign Up' : 'Sign In';
  const anotherMode = isRegistration ? 'Already have an account' : 'Register';

  return (
    <form onSubmit={handleSubmit}>
      <Stack align={'flex-start'}>
        <h3>{pageTitle}</h3>
        <Controller
          rules={{ required: true }}
          control={form.control}
          name={'username'}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextInput {...fieldProps} label="Username" error={errors.username?.type} />
          )}
        />

        <Controller
          rules={{ required: true }}
          control={form.control}
          name={'password'}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextInput {...fieldProps} label={'Password'} error={errors.password?.type} />
          )}
        />

        <Group>
          <Button type={'submit'}>Continue</Button>
          {props.isRegistrationEnabled && <Button onClick={changeMode}>{anotherMode}</Button>}
        </Group>
      </Stack>
    </form>
  );
};

export default LoginPage;
