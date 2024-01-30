'use server';

import { getDb } from '../../../db';
import { NewDividend, dividendsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.dividends);
};

export const getDividends = async () => {
  const db = await getDb();
  const result = await db.query.dividendsTable.findMany({
    with: {
      asset: true,
      broker: true,
    },
  });

  return result;
};

export const getDividend = async (id: string) => {
  const db = await getDb();

  const result = await db.query.dividendsTable.findFirst({
    where: eq(dividendsTable.id, id),
  });

  return result;
};

export const createDividend = async (data: NewDividend) => {
  const db = await getDb();
  const [result] = await db.insert(dividendsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateDividend = async (id: string, data: NewDividend) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(dividendsTable).set(dataWithoutId).where(eq(dividendsTable.id, id));

  revalidate();
  return id;
};

export const deleteDividend = async (id: string) => {
  const db = await getDb();
  await db.delete(dividendsTable).where(eq(dividendsTable.id, id));

  revalidate();
};
