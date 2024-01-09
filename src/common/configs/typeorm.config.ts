import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from './app.config';

const config = appConfig();

export const connectionSource = new DataSource(
  config.database as DataSourceOptions,
);
