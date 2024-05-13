'use server';

import { getDB } from '../../../db';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { NewTransfer, Transfer } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.transfers);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Transfer);
};

export const getTransfers = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      asset: true,
      brokerFrom: true,
      brokerTo: true,
    },
  });

  return instanceToPlain(result) as Transfer[];
};

export const getTransfer = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Transfer;
};

export const createTransfer = async (data: NewTransfer) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateTransfer = async (id: string, data: NewTransfer) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteTransfer = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
