'use server';

import { importFromFinam as importFromFinamLib } from './api';

export const importFromFinam = async (data: FormData) => {
  const file = data.get('file') as File | null;

  if (!file) {
    throw new Error('no file');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await importFromFinamLib(buffer);

  // TODO: done status
};
