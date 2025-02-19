import { Pool } from "pg";
import { config } from "dotenv";

config();

const connectionString = process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

export default pool;
