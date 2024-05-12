'use server';

import { getDb } from '../../../db';
import { NewSplit, splitsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.splits);
};

export const getSplits = async () => {
  const db = await getDb();
  const result = await db.query.splitsTable.findMany({
    with: {
      asset: true,
    },
  });

  return result;
};

export const getSplit = async (id: string) => {
  const db = await getDb();

  const result = await db.query.splitsTable.findFirst({
    where: eq(splitsTable.id, id),
  });

  return result;
};

export const createSplit = async (data: NewSplit) => {
  const db = await getDb();
  const [result] = await db.insert(splitsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateSplit = async (id: string, data: NewSplit) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(splitsTable).set(dataWithoutId).where(eq(splitsTable.id, id));

  revalidate();
  return id;
};

export const deleteSplit = async (id: string) => {
  const db = await getDb();
  await db.delete(splitsTable).where(eq(splitsTable.id, id));

  revalidate();
};
