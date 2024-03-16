import type * as User from '../user/entities'

type Id = number

type PgReturningId = {
  id: Id
}

type Resource = {
  user_id: User.Id
  title: string
  content: string
  created_at: Date
  hit: number
}

type PersistedResource = Resource & { id: Id }

export type { Id, Resource, PersistedResource, PgReturningId }
