import type Pg from 'pg'

export const pgSelectQuery =
  (pool: Pg.Pool) =>
  async <T extends Pg.QueryResultRow>(
    query: string,
    values?: any[]
  ): Promise<null | T> => {
    try {
      const result = await pool.query<T>(query, values)
      if (result.rows.length === 0) {
        return null
      }
      return result.rows[0]
    } catch (error) {
      throw new Error('pg error')
    }
  }

export const pgInsertQuery =
  (pool: Pg.Pool) =>
  async (query: string, values?: any[]): Promise<number> => {
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error('pg error')
    }
  }
