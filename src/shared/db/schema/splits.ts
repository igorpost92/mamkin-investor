import { relations } from 'drizzle-orm';
import { pgTable, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { assetsTable } from './assets';

export const splitsTable = pgTable('splits', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  assetId: uuid('assetId').notNull(),
  ratio: numeric('ratio').notNull(),

  // TODO: need? the only case is SPBE
  // currency: text('currency').notNull(),
});

export const splitsRelations = relations(splitsTable, ({ one }) => ({
  asset: one(assetsTable, {
    fields: [splitsTable.assetId],
    references: [assetsTable.id],
  }),
}));

export type Split = typeof splitsTable.$inferSelect;
export type NewSplit = typeof splitsTable.$inferInsert;
