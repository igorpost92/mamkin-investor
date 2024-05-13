import 'reflect-metadata';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Transfer } from './entities/transfer';
import { Broker } from './entities/broker';
import { Asset } from './entities/asset';

const pgConnection = new DataSource({
  // TODO: envs
  type: 'postgres',
  host: 'localhost',
  port: 5500,
  database: 'mamkin-investor',
  username: 'postgres',
  password: 'postgres',
  synchronize: true,
  // logging: true,
  entities: [Broker, Asset, Transfer],
});

export const getDBConnection = async (): Promise<DataSource> => {
  // TODO:
  pg.types.setTypeParser(1184, (v: any) => new Date(v));

  if (!pgConnection.isInitialized) {
    await pgConnection.initialize();
  }

  return pgConnection;
};
