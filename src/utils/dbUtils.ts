/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from 'drizzle-orm';
import { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

export function objArray<T>({ table, id }: { table: any; id: any }) {
  return sql<
    Array<T>
  >`COALESCE(json_arrayagg(DISTINCT ${table}) FILTER (WHERE ${id} IS NOT NULL), '[]')`;
}
