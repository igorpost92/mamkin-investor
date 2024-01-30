'use server';

import { getDb } from '../../../db';
import { brokersTable, NewBroker } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.brokers);
};

export const getBrokers = async () => {
  const db = await getDb();
  return db.select().from(brokersTable).orderBy(brokersTable.name);
};

export const getBroker = async (id: string) => {
  const db = await getDb();

  const result = await db.query.brokersTable.findFirst({
    where: eq(brokersTable.id, id),
  });

  return result;
};

export const createBroker = async (data: NewBroker) => {
  const db = await getDb();
  const [result] = await db.insert(brokersTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateBroker = async (id: string, data: NewBroker) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(brokersTable).set(dataWithoutId).where(eq(brokersTable.id, id));

  revalidate();
  return id;
};

export const deleteBroker = async (id: string) => {
  const db = await getDb();
  await db.delete(brokersTable).where(eq(brokersTable.id, id));

  revalidate();
};
