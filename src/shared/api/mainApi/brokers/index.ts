'use server';

import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';
import { getDB } from '../../../db';
import { Broker, NewBroker } from '../../../db/entities';
import { instanceToPlain } from 'class-transformer';

const revalidate = () => {
  revalidatePath(appRoutes.brokers);
};

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Broker);
};

export const getBrokers = async () => {
  const repo = await getRepo();
  const result = await repo.find({
    order: { name: 'asc' },
  });

  return instanceToPlain(result) as Broker[];
};

export const getBroker = async (id: string) => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { id },
  });

  return instanceToPlain(result) as Broker;
};

export const createBroker = async (data: NewBroker) => {
  const repo = await getRepo();
  const result = await repo.insert(data);

  revalidate();
  return result.identifiers[0].id as string;
};

export const updateBroker = async (id: string, data: NewBroker) => {
  const { id: _id, ...dataWithoutId } = data;

  const repo = await getRepo();
  await repo.update(id, dataWithoutId);

  revalidate();
  return id;
};

export const deleteBroker = async (id: string) => {
  const repo = await getRepo();
  await repo.delete(id);

  revalidate();
};
