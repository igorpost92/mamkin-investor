'use server';

import { getDb } from '../../../db';
import { NewWithdrawal, withdrawalsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { appRoutes } from '../../../constants';

const revalidate = () => {
  revalidatePath(appRoutes.withdrawals);
};

export const getWithdrawals = async () => {
  const db = await getDb();
  const result = await db.query.withdrawalsTable.findMany({
    with: {
      broker: true,
    },
  });

  return result;
};

export const getWithdrawal = async (id: string) => {
  const db = await getDb();

  const result = await db.query.withdrawalsTable.findFirst({
    where: eq(withdrawalsTable.id, id),
  });

  return result;
};

export const createWithdrawal = async (data: NewWithdrawal) => {
  const db = await getDb();
  const [result] = await db.insert(withdrawalsTable).values(data).returning();

  revalidate();
  return result.id;
};

export const updateWithdrawal = async (id: string, data: NewWithdrawal) => {
  const { id: _id, ...dataWithoutId } = data;

  const db = await getDb();
  await db.update(withdrawalsTable).set(dataWithoutId).where(eq(withdrawalsTable.id, id));

  revalidate();
  return id;
};

export const deleteWithdrawal = async (id: string) => {
  const db = await getDb();
  await db.delete(withdrawalsTable).where(eq(withdrawalsTable.id, id));

  revalidate();
};
