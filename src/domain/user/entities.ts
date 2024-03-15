type Id = string
type Email = string
type Name = string

type User = {
  id: Id
  name: Name
  email: Email
  createdAt: Date
  updatedAt: Date
}

export type { Id, User, Name, Email }
