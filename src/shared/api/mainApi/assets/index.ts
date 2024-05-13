'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Asset, NewAsset } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.assets);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Asset);
};

export const getAssets = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    order: { name: 'asc' },
  });

  return instanceToPlain(result) as Asset[];
};

export const getAsset = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Asset;
};

export const createAsset = async (data: NewAsset) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateAsset = async (id: string, data: NewAsset) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteAsset = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
