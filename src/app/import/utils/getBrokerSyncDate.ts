import { getDB } from '../../../shared/db';

export const getBrokerSyncDate = async (brokerId: string) => {
  const query = `
    select date 
    from (
      select date from purchases
      where "brokerId" = $1
      
      union all
            
      select date from sells
      where "brokerId" = $1
      
      union all
            
      select date from deposits
      where "brokerId" = $1
      
      union all
            
      select date from dividends
      where "brokerId" = $1
      
      union all
            
      select date from withdraws
      where "brokerId" = $1
    ) q
    order by date desc
    limit 1
  `;

  const db = await getDB();
  const res = await db.query(query, [brokerId]);

  if (!res.length) {
    return;
  }

  const date = new Date(res[0].date);
  return date as Date;
};
