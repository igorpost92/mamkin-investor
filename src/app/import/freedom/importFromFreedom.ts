'use server';

import { importFromFreedom as importFromFreedomLib } from './api';

export const importFromFreedom = async (data: FormData) => {
  const file = data.get('file') as File | null;

  if (!file) {
    throw new Error('no file');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const content = buffer.toString();

  await importFromFreedomLib(content);
};
