'use server';

import { getDb } from '../../../db';
import { NewDeposit, depositsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.deposits);
};

export const getDeposits = async () => {
  const db = await getDb();
  const result = await db.query.depositsTable.findMany({
    with: {
      broker: true,
    },
  });

  return result;
};

export const getDeposit = async (id: string) => {
  const db = await getDb();

  const result = await db.query.depositsTable.findFirst({
    where: eq(depositsTable.id, id),
  });

  return result;
};

export const createDeposit = async (data: NewDeposit) => {
  const db = await getDb();
  const [result] = await db.insert(depositsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateDeposit = async (id: string, data: NewDeposit) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(depositsTable).set(dataWithoutId).where(eq(depositsTable.id, id));

  revalidate();
  return id;
};

export const deleteDeposit = async (id: string) => {
  const db = await getDb();
  await db.delete(depositsTable).where(eq(depositsTable.id, id));

  revalidate();
};
