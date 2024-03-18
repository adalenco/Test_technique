import type { EventEmitter } from 'events'

import * as eventData from '@application/events/index'

import type * as Events from '@application/events/entities'

export const events = (event: EventEmitter, repository: Events.Repository) => {
  event.on(eventData.RESOURCE_ACCESS_EVENT, repository.incrementResourceHit)
}
