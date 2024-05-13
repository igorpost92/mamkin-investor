'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Sell, NewSell } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.assets);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Sell);
};

export const getSells = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      asset: true,
      broker: true,
    },
  });

  return instanceToPlain(result) as Sell[];
};

export const getSell = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Sell;
};

export const createSell = async (data: NewSell) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateSell = async (id: string, data: NewSell) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteSell = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
