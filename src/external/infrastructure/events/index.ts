import type { EventEmitter } from 'events'

import * as eventData from '@application/events/index'
import type * as Events from '@application/events/entitites'

export const events = (event: EventEmitter, repository: Events.Repository) => {
  event.on(eventData.RESOURCE_ACCESS_EVENT, repository.incrementResourceHit)
}
