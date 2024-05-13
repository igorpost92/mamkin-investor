'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Purchase, NewPurchase } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.purchases);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Purchase);
};

export const getPurchases = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      asset: true,
      broker: true,
    },
  });

  return instanceToPlain(result) as Purchase[];
};

export const getPurchase = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Purchase;
};

export const createPurchase = async (data: NewPurchase) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updatePurchase = async (id: string, data: NewPurchase) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deletePurchase = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
