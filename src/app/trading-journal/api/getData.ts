import { sqlRelationColumn } from '../../../shared/db/utils';
import { TradingJournalDatum } from '../config/types';
import { Asset, Broker } from '../../../shared/db/entities';
import { getDB } from '../../../shared/db';

// TODO: what do u want here?

export const getData = async () => {
  const assetColumnSql = await sqlRelationColumn(Asset, 'a');
  const brokerColumnSql = await sqlRelationColumn(Broker, 'b');

  const query = `
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
  `;

  const db = await getDB();
  const result = await db.query(query);

  return result as TradingJournalDatum[];
};
