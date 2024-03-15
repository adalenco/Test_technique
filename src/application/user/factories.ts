import { v4 as uuidv4 } from 'uuid'

import type * as User from '../../domain/user/entities'

export const userFactory = (name: User.Name, email: User.Email): User.User => ({
  id: uuidv4(),
  name,
  email,
  createdAt: new Date(),
  updatedAt: new Date()
})
