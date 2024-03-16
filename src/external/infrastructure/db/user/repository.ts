import type Pg from 'pg'

import * as Repository from '@domain/user/repository'

import type * as PgUser from './entities'
import * as utils from './utils'

const getOneUserById =
  (pool: Pg.Pool): Repository.GetOneUserById =>
  async (id) => {
    const query = `
    SELECT * FROM public.users
    WHERE id=$1;`
    const values = [id]
    try {
      const result = await pool.query<PgUser.PersistedUser>(query, values)
      if (result.rows.length === 0) {
        return null
      }
      return utils.fromPgPersistedUserToPersistedUser(result.rows[0])
    } catch (error) {
      throw new Error('pg error')
    }
  }

const getOneUserByEmail =
  (pool: Pg.Pool): Repository.GetOneUserByEmail =>
  async (email) => {
    const query = `
    SELECT * FROM public.users
    WHERE email=$1;`
    const values = [email]
    try {
      const result = await pool.query<PgUser.PersistedUser>(query, values)
      if (result.rows.length === 0) {
        return null
      }
      return utils.fromPgPersistedUserToPersistedUser(result.rows[0])
    } catch (error) {
      throw new Error('pg error')
    }
  }

const saveOneUser =
  (pool: Pg.Pool): Repository.SaveOneUser =>
  async (user) => {
    const query = `
    INSERT INTO public.users
    (name, email, created_at, updated_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id;`
    const values = [user.name, user.email, user.createdAt, user.updatedAt]
    try {
      const result = await pool.query<PgUser.PgReturningId>(query, values)
      return result.rows[0].id
    } catch (error) {
      throw new Error('pg error')
    }
  }

const updateOneUser =
  (pool: Pg.Pool): Repository.UpdateOneUser =>
  async (user) => {
    const query = `
      UPDATE public.users
      SET name = $1, email = $2, updated_at= $3
      WHERE id = $4`
    const values = [user.name, user.email, new Date(), user.id]
    try {
      await pool.query(query, values)
    } catch (error) {
      throw new Error('pg error')
    }
  }

const deleteOneUser =
  (pool: Pg.Pool): Repository.DeleteOneUserById =>
  async (id) => {
    const query = `
        DELETE FROM public.users
        WHERE id = $1`
    const values = [id]
    try {
      await pool.query(query, values)
    } catch (error) {
      throw new Error('pg error')
    }
  }

export {
  getOneUserById,
  getOneUserByEmail,
  saveOneUser,
  updateOneUser,
  deleteOneUser
}
