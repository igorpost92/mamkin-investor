import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const brokersTable = pgTable('brokers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

export type Broker = typeof brokersTable.$inferSelect;
export type NewBroker = typeof brokersTable.$inferInsert;
