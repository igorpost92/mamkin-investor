import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const assetsTable = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ticker: text('ticker'),
  isin: text('isin'),
  currency: text('currency'),
  type: text('type'), // TODO: enum
  uid: text('uid'),
});

export type Asset = typeof assetsTable.$inferSelect;
export type NewAsset = typeof assetsTable.$inferInsert;
