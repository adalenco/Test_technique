import type * as Resource from '@domain/resource/entities'

import type * as PgResource from './entities'

export const fromPgPersistedResourceToPersistedResource = (
  pgResource: PgResource.PersistedResource
): Resource.PersistedResource => ({
  id: pgResource.id,
  publisher: pgResource.user_id,
  title: pgResource.title,
  content: pgResource.content,
  publishedAt: pgResource.created_at,
  hit: pgResource.hit
})
