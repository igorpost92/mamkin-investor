'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Dividend, NewDividend } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.dividends);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Dividend);
};

export const getDividends = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      asset: true,
      broker: true,
    },
  });

  return instanceToPlain(result) as Dividend[];
};

export const getDividend = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Dividend;
};

export const createDividend = async (data: NewDividend) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateDividend = async (id: string, data: NewDividend) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteDividend = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
