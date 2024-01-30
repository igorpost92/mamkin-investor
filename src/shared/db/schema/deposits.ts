import { pgTable, text, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { brokersTable } from './brokers';
import { relations } from 'drizzle-orm';

export const depositsTable = pgTable('deposits', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  brokerId: uuid('brokerId')
    .references(() => brokersTable.id)
    .notNull(),
  currency: text('currency').notNull(),
  sum: numeric('sum').notNull(),
  brokerTransactionId: text('brokerTransactionId'),
});

export const depositsRelations = relations(depositsTable, ({ one }) => ({
  broker: one(brokersTable, {
    fields: [depositsTable.brokerId],
    references: [brokersTable.id],
  }),
}));

export type Deposit = typeof depositsTable.$inferSelect;
export type NewDeposit = typeof depositsTable.$inferInsert;
