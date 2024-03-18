import type * as Resource from '@domain/resource/entities'

enum IncrementResourceHitErrors {
  NoRessourceWithThisId = 'No resource with this id'
}

type IncrementResourceHit = (
  id: Resource.Id
) => Promise<IncrementResourceHitErrors | Resource.Hit>

interface Repository {
  incrementResourceHit: IncrementResourceHit
}

export type { IncrementResourceHit, Repository }

export { IncrementResourceHitErrors }
