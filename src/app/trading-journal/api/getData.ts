import { sqlRelationColumn } from '../../../shared/db/utils';
import { assetsTable, brokersTable } from '../../../shared/db/schema';
import { sql } from 'drizzle-orm';
import { getDb } from '../../../shared/db';
import { TradingJournalDatum } from '../config/types';

// TODO: what do u want here?

export const getData = async () => {
  const assetColumnSql = sqlRelationColumn(assetsTable, 'a');
  const brokerColumnSql = sqlRelationColumn(brokersTable, 'b');

  const query = sql.raw(`
    select 
    q.id, operation, date, 
    ${assetColumnSql} asset, ${brokerColumnSql} broker,
    q.currency, quantity, sum, price
    from (
      select id, 'purchase' operation, date, "brokerId", "assetId", currency, quantity, sum, price
      from purchases
      union all
      select id, 'sell', date, "brokerId", "assetId", currency, -1 * quantity, -1 * sum, price
      from sells
    ) q
    left join assets a on q."assetId" = a.id
    left join brokers b on q."brokerId" = b.id
  `);

  const db = await getDb();
  const { rows: result } = await db.execute(query);

  // TODO: drizzle date field bug
  const parsedData = result.map((item: any) => ({
    ...item,
    date: new Date(item.date),
  }));

  return parsedData as TradingJournalDatum[];
};
