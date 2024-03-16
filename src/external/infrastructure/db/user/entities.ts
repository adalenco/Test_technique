type Id = number

type PgReturningId = {
  id: Id
}

type User = {
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

type PersistedUser = User & { id: Id }

export type { Id, User, PersistedUser, PgReturningId }
