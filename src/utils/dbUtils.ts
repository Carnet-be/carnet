/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "drizzle-orm";

export function objArray<T>({ table, id }: { table: any; id: any }) {
  return sql<
    Array<T>
  >`COALESCE(json_agg(row_to_json(${table})) FILTER (WHERE ${id} IS NOT NULL), '[]')`;
}
