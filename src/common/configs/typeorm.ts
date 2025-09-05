// imports
import { DataSource, } from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

// models
import {
  Event,
  EventMetadata,
  EventToken,
  Location,
  Payment,
  Profit,
  Registration,
  Ticket,
  WhitelistedToken,
  POAP,
} from "../../model";

export const AppDataSource = new DataSource({
  applicationName: "Rendevu",
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || undefined,
  database: process.env.DB_NAME || "postgres",
  entities: [
    Event,
    EventMetadata,
    EventToken,
    Location,
    Payment,
    Profit,
    Registration,
    Ticket,
    WhitelistedToken,
    POAP,
  ],
  // logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});