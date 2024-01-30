import { pgTable, text, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { brokersTable } from './brokers';
import { assetsTable } from './assets';
import { relations } from 'drizzle-orm';

export const sellsTable = pgTable('sells', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  brokerId: uuid('brokerId')
    .references(() => brokersTable.id)
    .notNull(),
  assetId: uuid('assetId')
    .references(() => assetsTable.id)
    .notNull(),
  currency: text('currency').notNull(),
  quantity: numeric('quantity').notNull(),
  price: numeric('price').notNull(),
  sum: numeric('sum').notNull(),
  commission: numeric('commission'),
  brokerTransactionId: text('brokerTransactionId'),
});

export const sellsRelations = relations(sellsTable, ({ one }) => ({
  asset: one(assetsTable, {
    fields: [sellsTable.assetId],
    references: [assetsTable.id],
  }),
  broker: one(brokersTable, {
    fields: [sellsTable.brokerId],
    references: [brokersTable.id],
  }),
}));

export type Sell = typeof sellsTable.$inferSelect;
export type NewSell = typeof sellsTable.$inferInsert;
