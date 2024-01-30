import { pgTable, text, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { brokersTable } from './brokers';
import { assetsTable } from './assets';
import { relations } from 'drizzle-orm';

export const dividendsTable = pgTable('dividends', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  // TODO:
  closeDate: timestamp('closeDate', { mode: 'date' }),
  brokerId: uuid('brokerId')
    .references(() => brokersTable.id)
    .notNull(),
  assetId: uuid('assetId')
    .references(() => assetsTable.id)
    .notNull(),
  currency: text('currency').notNull(),
  sum: numeric('sum').notNull(),
  sumRub: numeric('sumRub').notNull(),
  commission: numeric('commission'),
  brokerTransactionId: text('brokerTransactionId'),
});

export const dividendsRelations = relations(dividendsTable, ({ one }) => ({
  asset: one(assetsTable, {
    fields: [dividendsTable.assetId],
    references: [assetsTable.id],
  }),
  broker: one(brokersTable, {
    fields: [dividendsTable.brokerId],
    references: [brokersTable.id],
  }),
}));

export type Dividend = typeof dividendsTable.$inferSelect;
export type NewDividend = typeof dividendsTable.$inferInsert;
