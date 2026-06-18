import { createClient } from "@vercel/postgres";

const connectionString = process.env.POSTGRES_URL;

const client = createClient(connectionString ? { connectionString } : undefined);

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  return client.sql(strings, ...values);
}
