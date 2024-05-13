'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Split, NewSplit } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.splits);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Split);
};

export const getSplits = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      asset: true,
    },
  });

  return instanceToPlain(result) as Split[];
};

export const getSplit = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Split;
};

export const createSplit = async (data: NewSplit) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateSplit = async (id: string, data: NewSplit) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteSplit = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
