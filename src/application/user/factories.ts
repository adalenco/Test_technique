import type * as User from '@domain/user/entities'

export const userFactory = (name: User.Name, email: User.Email): User.User => ({
  name,
  email,
  createdAt: new Date(),
  updatedAt: new Date()
})
