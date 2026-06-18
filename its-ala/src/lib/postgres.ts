import { createClient } from "@vercel/postgres";

const connectionString = process.env.POSTGRES_URL;
const client = createClient(connectionString ? { connectionString } : undefined);

export type SqlPrimitive = string | number | boolean | null | undefined;

export function sql(strings: TemplateStringsArray, ...values: SqlPrimitive[]) {
  return client.sql(strings, ...values);
}
