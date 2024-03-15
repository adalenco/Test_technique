import type { EventEmitter } from 'events'
import type * as Resource from '../../domain/resource/entities'

const RESOURCE_ACCESS_EVENT = 'RESOURCE_ACCESS_EVENT'

const emitResourceAccessEvent =
  (eventHandler: EventEmitter) => (id: Resource.Id) => {
    try {
      eventHandler.emit(RESOURCE_ACCESS_EVENT, id)
    } catch (error) {
      throw new Error(
        `Error firing RESOURCE_ACCESS_EVENT: ${JSON.stringify(error)}`
      )
    }
  }

const onResourceAccessEvent = () => {
  const event = new EventEmitter()
  event.on(RESOURCE_ACCESS_EVENT, (id) => {})
}

export { RESOURCE_ACCESS_EVENT, emitResourceAccessEvent }
