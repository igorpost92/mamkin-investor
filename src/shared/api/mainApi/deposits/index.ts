'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Deposit, NewDeposit } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.deposits);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Deposit);
};

export const getDeposits = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      broker: true,
    },
  });

  return instanceToPlain(result) as Deposit[];
};

export const getDeposit = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Deposit;
};

export const createDeposit = async (data: NewDeposit) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateDeposit = async (id: string, data: NewDeposit) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteDeposit = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
