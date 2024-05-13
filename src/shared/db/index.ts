import 'reflect-metadata';
import pg from 'pg';
import { DataSource, EntityManager } from 'typeorm';
import {
  Asset,
  Broker,
  Deposit,
  Dividend,
  Purchase,
  Sell,
  Split,
  Transfer,
  Withdrawal,
} from './entities';

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
  entities: [Asset, Broker, Deposit, Dividend, Purchase, Sell, Split, Transfer, Withdrawal],
});

export const getDB = async (): Promise<DataSource> => {
  // TODO:
  pg.types.setTypeParser(1184, (v: any) => new Date(v));

  if (!pgConnection.isInitialized) {
    await pgConnection.initialize();
  }

  return pgConnection;
};

export type NewTx = EntityManager;
