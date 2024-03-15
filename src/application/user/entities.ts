import type * as User from '../../domain/user/entities'

enum GetUserErrors {
  NoUserWithThisId = 'No user with this Id'
}
enum CreateUserErrors {
  UserEmailAlreadyExists = 'User with this email already exists'
}
enum UpdateUserErrors {
  NoUserWithThisId = 'No user with this Id',
  UserEmailAlreadyExists = 'User with this email already exists'
}

type GetUser = (id: User.Id) => Promise<GetUserErrors | User.User>

type CreateUser = (
  name: User.Name,
  email: User.Email
) => Promise<CreateUserErrors | User.Id>

type DeleteUser = (id: User.Id) => Promise<void>

type UpdateUser = (
  id: User.Id,
  name?: User.Name,
  email?: User.Email
) => Promise<UpdateUserErrors | void>

interface Repository {
  getUser: GetUser
  createUser: CreateUser
  deleteUser: DeleteUser
  updateUser: UpdateUser
}

export type { Repository, GetUser, CreateUser, DeleteUser, UpdateUser }

export { GetUserErrors, CreateUserErrors, UpdateUserErrors }
