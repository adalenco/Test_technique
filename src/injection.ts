import type { Client } from 'pg'
import type { EventEmitter } from 'events'

import * as userUseCases from '@application/user'
import * as resourceUseCases from '@application/resource'
import * as eventHandler from '@application/events'
import * as userRepository from '@db/user/repository'
import * as resourceRepository from '@db/resource/repository'
import * as userRouter from '@api/routes/user'
import * as resourceRouter from '@api/routes/resource'
import * as events from '@events/index'

export const injection = (client: Client, event: EventEmitter) => {
  const userRouterLoaded = userRouter.routes(
    userUseCases.useCases(
      userRepository.getOneUserById(client),
      userRepository.getOneUserByEmail(client),
      userRepository.deleteOneUser(client),
      userRepository.saveOneUser(client),
      userRepository.updateOneUser(client)
    )
  )

  const resourceRoutesLoaded = resourceRouter.routes(
    resourceUseCases.useCases(
      userRepository.getOneUserById(client),
      resourceRepository.saveOneResource(client),
      resourceRepository.getOneResourceById(client),
      resourceRepository.deleteOneResource(client),
      eventHandler.emitResourceAccessEvent(event)
    )
  )

  events.events(
    event,
    eventHandler.useCases(
      resourceRepository.getOneResourceById(client),
      resourceRepository.updateOneResource(client)
    )
  )

  return {
    userRoutes: userRouterLoaded,
    resourceRoutes: resourceRoutesLoaded
  }
}
