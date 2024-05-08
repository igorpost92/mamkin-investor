'use server';

import { importFromAlfa as importFromAlfaLib } from './api';

export const importFromAlfa = async (data: FormData) => {
  const file = data.get('file') as File | null;

  if (!file) {
    throw new Error('no file');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await importFromAlfaLib(buffer);
};
