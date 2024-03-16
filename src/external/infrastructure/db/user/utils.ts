import type * as User from '@domain/user/entities'

import type * as PgUser from './entities'

export const fromPgPersistedUserToPersistedUser = (
  pgUser: PgUser.PersistedUser
): User.PersistedUser => ({
  id: pgUser.id,
  name: pgUser.name,
  email: pgUser.email,
  createdAt: pgUser.created_at,
  updatedAt: pgUser.updated_at
})
