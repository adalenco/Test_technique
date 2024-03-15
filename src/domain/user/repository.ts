import type * as User from './entities'

type GetOneUserById = (id: User.Id) => Promise<null | User.User>

type GetOneUserByEmail = (email: User.Email) => Promise<null | User.User>

type SaveOneUser = (user: User.User) => Promise<User.Id>

type UpdateOneUser = (user: User.User) => Promise<void>

type DeleteOneUserById = (id: User.Id) => Promise<void>

export type {
  GetOneUserByEmail,
  GetOneUserById,
  SaveOneUser,
  UpdateOneUser,
  DeleteOneUserById
}
