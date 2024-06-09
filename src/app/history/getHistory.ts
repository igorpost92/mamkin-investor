import { prepareForBuildObject } from '../../shared/db/utils';
import {
  Asset,
  Broker,
  Deposit,
  Dividend,
  Purchase,
  Sell,
  Transfer,
  Withdrawal,
} from '../../shared/db/entities';
import { getDB } from '../../shared/db';

interface Filters {
  assetId?: string;
  brokerId?: string;
}

const getAssetField = async () => {
  const assetColumns = await prepareForBuildObject(Asset, 'a');
  const assetField = `'asset', json_build_object(${assetColumns})`;
  return assetField;
};

const getTransferField = async () => {
  const assetField = await getAssetField();
  const transferColumns = await prepareForBuildObject(Transfer, 't');
  const brokerFromColumns = await prepareForBuildObject(Broker, 'bFrom');
  const brokerToColumns = await prepareForBuildObject(Broker, 'bTo');

  const transferField = `
    select 
      date,
      'transfer' "operationType",
      json_build_object(
        ${transferColumns},
        'brokerFrom', json_build_object(${brokerFromColumns}),
        'brokerTo', json_build_object(${brokerToColumns}),
        ${assetField}
      ) document
    from transfers t
    left join brokers "bFrom"
    on "bFrom".id = "brokerFromId"
    left join brokers "bTo"
    on "bTo".id = "brokerToId"
    left join assets a
    on a.id = "assetId"
    where 
    ("brokerFromId" = $1 or "brokerToId" = $1 or $1 is null)
    and ("assetId" = $2 or $2 is null)
  `;

  return transferField;
};

export const getHistory = async (filters?: Filters) => {
  const brokerColumns = await prepareForBuildObject(Broker, 'b');
  const depositColumns = await prepareForBuildObject(Deposit, 'd');
  const purchaseColumns = await prepareForBuildObject(Purchase, 'p');
  const dividendColumns = await prepareForBuildObject(Dividend, 'div');
  const sellColumns = await prepareForBuildObject(Sell, 's');
  const withdrawalColumns = await prepareForBuildObject(Withdrawal, 'w');

  const assetField = await getAssetField();
  const brokerField = `'broker', json_build_object(${brokerColumns})`;

  const depositField = `
    select 
      date,
      'deposit' "operationType",
      json_build_object(
        ${depositColumns},
        ${brokerField}
      ) document
    from deposits d
    left join brokers b
    on b.id = "brokerId"
    where 
    "brokerId" = $1 or $1 is null
  `;

  const purchaseField = `
    select 
      date,
      'purchase' "operationType",
      json_build_object(
        ${purchaseColumns},
        ${brokerField},
        ${assetField}
      ) document
    from purchases p
    left join brokers b
    on b.id = "brokerId"
    left join assets a
    on a.id = "assetId"
    where 
    ("brokerId" = $1 or $1 is null)
    and ("assetId" = $2 or $2 is null)
  `;

  const dividendField = `
    select 
      date,
      'dividend' "operationType",
      json_build_object(
        ${dividendColumns},
        ${brokerField},
        ${assetField}
      ) document
    from dividends div
    left join brokers b
    on b.id = "brokerId"
    left join assets a
    on a.id = "assetId"
    where 
    ("brokerId" = $1 or $1 is null)
    and ("assetId" = $2 or $2 is null)
  `;

  const transferField = await getTransferField();

  // TODO: calc result for sell. and if it was a short

  const sellField = `
    select 
      date,
      'sell' "operationType",
      json_build_object(
        ${sellColumns},
        ${brokerField},
        ${assetField}
      ) document
    from sells s
    left join brokers b
    on b.id = "brokerId"
    left join assets a
    on a.id = "assetId"
    where 
    ("brokerId" = $1 or $1 is null)
    and ("assetId" = $2 or $2 is null)
  `;

  const withdrawalField = `
    select 
      date,
      'withdrawal' "operationType",
      json_build_object(
        ${withdrawalColumns},
        ${brokerField}
      ) document
    from withdraws w
    left join brokers b
    on b.id = "brokerId"
    where 
    "brokerId" = $1 or $1 is null
  `;

  const fields: string[] = [];

  if (!filters?.assetId) {
    fields.push(depositField);
  }

  fields.push(purchaseField, dividendField, transferField, sellField);

  if (!filters?.assetId) {
    fields.push(withdrawalField);
  }

  const fieldsQuery = fields.join('\n union all \n');

  const query = `
    select * 
    from (
      ${fieldsQuery}
    )
    order by date desc
  `;

  const db = await getDB();
  const res = await db.query(query, [filters?.brokerId, filters?.assetId]);
  return res;
};
