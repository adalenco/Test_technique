import type Pg from 'pg'

import * as Repository from '@domain/resource/repository'

import type * as PgResource from './entities'
import * as utils from './utils'

const getOneResourceById =
  (pool: Pg.Pool): Repository.GetOneResourceById =>
  async (id) => {
    const query = `
    SELECT * FROM public.resources
    WHERE id=$1;`
    const values = [id]
    try {
      const result = await pool.query<PgResource.PersistedResource>(
        query,
        values
      )
      if (result.rows.length === 0) {
        return null
      }
      return utils.fromPgPersistedResourceToPersistedResource(result.rows[0])
    } catch (error) {
      throw new Error('pg error')
    }
  }

const saveOneResource =
  (pool: Pg.Pool): Repository.SaveOneResource =>
  async (resource) => {
    const query = `
    INSERT INTO public.resources
    (user_id, title, content, created_at, hit)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;`
    const values = [
      resource.publisher,
      resource.title,
      resource.content,
      resource.publishedAt,
      resource.hit
    ]
    try {
      const result = await pool.query<PgResource.PgReturningId>(query, values)
      return result.rows[0].id
    } catch (error) {
      throw new Error('pg error')
    }
  }

const updateOneResource =
  (pool: Pg.Pool): Repository.UpdateOneResource =>
  async (resource) => {
    const query = `
      UPDATE public.resources
      SET user_id = $1, title = $2, content = $3, hit = $4
      WHERE id = $5`
    const values = [
      resource.publisher,
      resource.title,
      resource.content,
      resource.hit,
      resource.id
    ]
    try {
      await pool.query(query, values)
    } catch (error) {
      throw new Error('pg error')
    }
  }

const deleteOneResource =
  (pool: Pg.Pool): Repository.DeleteOneResourceById =>
  async (id) => {
    const query = `
        DELETE FROM public.resources
        WHERE id = $1`
    const values = [id]
    try {
      await pool.query(query, values)
    } catch (error) {
      throw new Error('pg error')
    }
  }

export {
  getOneResourceById,
  saveOneResource,
  updateOneResource,
  deleteOneResource
}
