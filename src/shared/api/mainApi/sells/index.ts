'use server';

import { getDb } from '../../../db';
import { NewSell, sellsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.assets);
};

export const getSells = async () => {
  const db = await getDb();
  const result = await db.query.sellsTable.findMany({
    with: {
      asset: true,
      broker: true,
    },
  });

  return result;
};

export const getSell = async (id: string) => {
  const db = await getDb();

  const result = await db.query.sellsTable.findFirst({
    where: eq(sellsTable.id, id),
  });

  return result;
};

export const createSell = async (data: NewSell) => {
  const db = await getDb();
  const [result] = await db.insert(sellsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateSell = async (id: string, data: NewSell) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(sellsTable).set(dataWithoutId).where(eq(sellsTable.id, id));

  revalidate();
  return id;
};

export const deleteSell = async (id: string) => {
  const db = await getDb();
  await db.delete(sellsTable).where(eq(sellsTable.id, id));

  revalidate();
};
