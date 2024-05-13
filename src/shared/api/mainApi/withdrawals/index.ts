'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Withdrawal, NewWithdrawal } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.withdrawals);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Withdrawal);
};

export const getWithdrawals = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    relations: {
      broker: true,
    },
  });

  return instanceToPlain(result) as Withdrawal[];
};

export const getWithdrawal = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Withdrawal;
};

export const createWithdrawal = async (data: NewWithdrawal) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateWithdrawal = async (id: string, data: NewWithdrawal) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteWithdrawal = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
