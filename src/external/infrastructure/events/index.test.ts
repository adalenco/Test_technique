import { EventEmitter } from 'events'

import * as eventData from '@application/events/index'

import * as events from './index'

describe('events', () => {
  describe('RESOURCE_ACCESS_EVENT', () => {
    it('should catch RESOURCE_ACCESS_EVENT event', () => {
      const event = new EventEmitter()
      const repositorySpy = {
        incrementResourceHit: jest.fn()
      }

      const idMock = 0

      events.events(event, repositorySpy)
      event.emit(eventData.RESOURCE_ACCESS_EVENT, idMock)
      expect(repositorySpy.incrementResourceHit).toHaveBeenCalledWith(idMock)
    })
  })
})
