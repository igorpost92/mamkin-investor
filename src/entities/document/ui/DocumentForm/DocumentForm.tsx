import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface Props {
  initialData?: Record<string, any>;
  onSubmit: (data: unknown) => void;
  children: React.ReactNode;
}

export const DocumentForm: React.FC<Props> = props => {
  const form = useForm({
    defaultValues: props.initialData,
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // prevent form submit on "enter" press
      e.stopPropagation();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} onKeyDown={onKeyDown}>
        {props.children}
      </form>
    </FormProvider>
  );
};

export default DocumentForm;
