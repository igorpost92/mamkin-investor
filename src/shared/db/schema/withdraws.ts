import { pgTable, text, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { brokersTable } from './brokers';
import { relations } from 'drizzle-orm';

// TODO: rename to withdrawal
export const withdrawalsTable = pgTable('withdraws', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  brokerId: uuid('brokerId')
    .references(() => brokersTable.id)
    .notNull(),
  currency: text('currency').notNull(),
  sum: numeric('sum').notNull(),
  brokerTransactionId: text('brokerTransactionId'),
});

export const withdrawalsRelations = relations(withdrawalsTable, ({ one }) => ({
  broker: one(brokersTable, {
    fields: [withdrawalsTable.brokerId],
    references: [brokersTable.id],
  }),
}));

export type Withdrawal = typeof withdrawalsTable.$inferSelect;
export type NewWithdrawal = typeof withdrawalsTable.$inferInsert;
