import * as process from 'node:process';
import { configDotenv } from 'dotenv';

configDotenv();

export class Environemnt {
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  static readonly PORT = Number(process.env.PORT ?? 3000);
  static readonly DB_HOST = process.env.DB_HOST ?? 'localhost';
  static readonly DB_PORT = Number(process.env.DB_PORT ?? 5431);
  static readonly DB_USERNAME = process.env.DB_USERNAME ?? 'db_user';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD ?? 'db_password';
  static readonly DB_NAME = process.env.DB_NAME ?? 'modular_monolith';
  static readonly WEBSOCKET_CORS = process.env.WEBSOCKET_CORS ?? '*';
  static readonly RABBITMQ_CONNECTION_URL = process.env.RABBITMQ_CONNECTION_URL ?? 'amqp://localhost:5672';
}
