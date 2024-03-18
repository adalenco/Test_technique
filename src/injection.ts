import type { Pool } from 'pg'
import type { EventEmitter } from 'events'

import * as userUseCases from '@application/user'
import * as resourceUseCases from '@application/resource'
import * as eventHandler from '@application/events'
import * as userRepository from '@db/user'
import * as resourceRepository from '@db/resource'
import * as userRouter from '@api/routes/user'
import * as resourceRouter from '@api/routes/resource'
import * as events from '@events/index'

export const injection = (pool: Pool, event: EventEmitter) => {
  const userRouterLoaded = userRouter.routes(
    userUseCases.useCases(
      userRepository.getOneUserById(pool),
      userRepository.getOneUserByEmail(pool),
      userRepository.deleteOneUser(pool),
      userRepository.saveOneUser(pool),
      userRepository.updateOneUser(pool)
    )
  )

  const resourceRoutesLoaded = resourceRouter.routes(
    resourceUseCases.useCases(
      userRepository.getOneUserById(pool),
      resourceRepository.saveOneResource(pool),
      resourceRepository.getOneResourceById(pool),
      resourceRepository.deleteOneResource(pool),
      eventHandler.emitResourceAccessEvent(event)
    )
  )

  events.events(
    event,
    eventHandler.useCases(
      resourceRepository.getOneResourceById(pool),
      resourceRepository.updateOneResource(pool)
    )
  )

  return {
    userRoutes: userRouterLoaded,
    resourceRoutes: resourceRoutesLoaded
  }
}
