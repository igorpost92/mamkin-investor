'use server';

import { getDb } from '../../../db';
import { assetsTable, NewAsset } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.assets);
};

export const getAssets = async () => {
  const db = await getDb();
  return db.select().from(assetsTable).orderBy(assetsTable.name);
};

export const getAsset = async (id: string) => {
  const db = await getDb();

  const result = await db.query.assetsTable.findFirst({
    where: eq(assetsTable.id, id),
  });

  return result;
};

export const createAsset = async (data: NewAsset) => {
  const db = await getDb();
  const [result] = await db.insert(assetsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateAsset = async (id: string, data: NewAsset) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(assetsTable).set(dataWithoutId).where(eq(assetsTable.id, id));

  revalidate();
  return id;
};

export const deleteAsset = async (id: string) => {
  const db = await getDb();
  await db.delete(assetsTable).where(eq(assetsTable.id, id));

  revalidate();
};
