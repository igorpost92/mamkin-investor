import { getDB } from './index';

type Table = {
  new (): any;
};

export const sqlRelationColumn = async (table: Table, alias: string) => {
  const db = await getDB();
  const columns = db.getMetadata(table).columns;

  const q = columns
    .map(column => `'${column.propertyName}', "${alias}"."${column.propertyName}"`)
    .join(',\n');

  const query = ['json_build_object(', q, ')'].join('\n');

  return query;
};
