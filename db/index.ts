import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type Db = PostgresJsDatabase<typeof schema>;

let _db: Db | null = null;

/**
 * Client Drizzle paresseux : la connexion n'est ouverte qu'au premier appel,
 * jamais au build. `prepare: false` est requis derrière le pooler Supabase
 * (transaction mode).
 */
export function getDb(): Db {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL est manquante. Renseignez-la dans .env.local (voir .env.example).'
      );
    }
    const client = postgres(url, { prepare: false });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export { schema };
