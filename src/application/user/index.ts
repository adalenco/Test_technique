import type * as UserRepository from '../../domain/user/repository'

import type * as UseCases from './entities'
import { GetUserErrors, CreateUserErrors, UpdateUserErrors } from './entities'
import * as factories from './factories'

export const useCases = (
  getOneUserById: UserRepository.GetOneUserById,
  getOneUserByEmail: UserRepository.GetOneUserByEmail,
  deleteOneUserById: UserRepository.DeleteOneUserById,
  saveOneUser: UserRepository.SaveOneUser,
  updateOneUser: UserRepository.UpdateOneUser
): UseCases.Repository => ({
  getUser: async (id) => {
    const user = await getOneUserById(id)
    if (user === null) {
      return GetUserErrors.NoUserWithThisId
    }
    return user
  },
  createUser: async (name, email) => {
    const user = await getOneUserByEmail(email)
    if (user !== null) {
      return CreateUserErrors.UserEmailAlreadyExists
    }
    const newUser = factories.userFactory(name, email)
    await saveOneUser(newUser)
    return newUser.id
  },
  deleteUser: async (id) => {
    await deleteOneUserById(id)
  },
  updateUser: async (id, name, email) => {
    const user = await getOneUserById(id)
    if (user === null) {
      return UpdateUserErrors.NoUserWithThisId
    }
    if (email !== undefined) {
      const userWithEmail = await getOneUserByEmail(email)
      if (userWithEmail !== null) {
        return UpdateUserErrors.UserEmailAlreadyExists
      }
    }
    const newUser = {
      ...user,
      email: email === undefined ? user.email : email,
      name: name === undefined ? user.name : name
    }
    await updateOneUser(newUser)
  }
})
