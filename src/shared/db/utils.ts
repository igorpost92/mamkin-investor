import { getDB } from './index';

type Table = {
  new (): any;
};

export const getTableColumnsNames = async (table: Table) => {
  const db = await getDB();
  const columns = db.getMetadata(table).columns;
  return columns.map(column => column.propertyName);
};

export const prepareForBuildObject = async (table: Table, alias?: string) => {
  const columns = await getTableColumnsNames(table);

  const q = columns
    .map(column => {
      const secondParam = alias ? `"${alias}"."${column}"` : `"${column}"`;
      return `'${column}', ${secondParam}`;
    })
    .join(',\n');

  return q;
};

export const sqlRelationColumn = async (table: Table, alias?: string) => {
  const q = await prepareForBuildObject(table, alias);

  const query = ['json_build_object(', q, ')'].join('\n');

  return query;
};
