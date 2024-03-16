type Id = number
type Email = string
type Name = string

type User = {
  name: Name
  email: Email
  createdAt: Date
  updatedAt: Date
}

type PersistedUser = User & { id: Id }

export type { Id, User, PersistedUser, Name, Email }
