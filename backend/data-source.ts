import "reflect-metadata";
import { DataSource } from "typeorm";
import { Supplier } from "./entities/Supplier";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "localhost",
  port: 1433,
  username: "Supplier",
  password: "TimothyZhou_123",
  database: "SupplierInfo",
  entities: [Supplier], // Add other entities here
  synchronize: true, // Disable in production! Use migrations instead.
  options: { encrypt: false }
});