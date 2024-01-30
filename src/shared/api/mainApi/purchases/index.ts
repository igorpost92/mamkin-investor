'use server';

import { getDb } from '../../../db';
import { NewPurchase, purchasesTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.purchases);
};

export const getPurchases = async () => {
  const db = await getDb();
  const result = await db.query.purchasesTable.findMany({
    with: {
      asset: true,
      broker: true,
    },
  });

  return result;
};

export const getPurchase = async (id: string) => {
  const db = await getDb();

  const result = await db.query.purchasesTable.findFirst({
    where: eq(purchasesTable.id, id),
  });

  return result;
};

export const createPurchase = async (data: NewPurchase) => {
  const db = await getDb();
  const [result] = await db.insert(purchasesTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updatePurchase = async (id: string, data: NewPurchase) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(purchasesTable).set(dataWithoutId).where(eq(purchasesTable.id, id));

  revalidate();
  return id;
};

export const deletePurchase = async (id: string) => {
  const db = await getDb();
  await db.delete(purchasesTable).where(eq(purchasesTable.id, id));

  revalidate();
};
