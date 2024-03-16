import type * as User from './entities'

type GetOneUserById = (id: User.Id) => Promise<null | User.PersistedUser>

type GetOneUserByEmail = (
  email: User.Email
) => Promise<null | User.PersistedUser>

type SaveOneUser = (user: User.User) => Promise<User.Id>

type UpdateOneUser = (user: User.PersistedUser) => Promise<void>

type DeleteOneUserById = (id: User.Id) => Promise<void>

export type {
  GetOneUserByEmail,
  GetOneUserById,
  SaveOneUser,
  UpdateOneUser,
  DeleteOneUserById
}
