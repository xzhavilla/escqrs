import { Effect, pipe } from '@effect-ts/core'
import { gen } from '@effect-ts/system/Effect'
import * as Layer from '@effect-ts/system/Layer'
import { $Layer } from '../../../../config/Layer.local'
import { $ServiceBus } from '../../../../src/entity/message/command/servicebus/ServiceBus'
import { $EventStore } from '../../../../src/entity/message/event/eventstore/EventStore'
import { $HttpServer } from '../../../../src/http/server/HttpServer'
import { $CreateFilm } from '../../film/message/command/CreateFilm'
import { $EditFilm } from '../../film/message/command/EditFilm'
import { $RemoveFilm } from '../../film/message/command/RemoveFilm'
import { $ScreeningsByFilm } from '../../projection/ScreeningsByFilm'
import { $CreateScreening } from '../../screening/command/CreateScreening'
import { CreateFilm } from './film/command/CreateFilm'
import { EditFilm } from './film/command/EditFilm'
import { RemoveFilm } from './film/command/RemoveFilm'
import { GetFilm } from './film/query/GetFilm'
import { GetFilms } from './film/query/GetFilms'
import { CreateScreen } from './screen/command/CreateScreen'
import { EditScreen } from './screen/command/EditScreen'
import { RemoveScreen } from './screen/command/RemoveScreen'
import { GetScreen } from './screen/query/GetScreen'
import { GetScreens } from './screen/query/GetScreens'
import { CreateScreening } from './screening/command/CreateScreening'
import { GetScreeningsByFilm } from './screening/query/GetScreeningsByFilm'

const handlers = [
  [CreateFilm, $CreateFilm.handler] as const,
  [EditFilm, $EditFilm.handler] as const,
  [RemoveFilm, $RemoveFilm.handler] as const,
  [
    CreateScreening,
    $CreateScreening.handler,
    $ScreeningsByFilm.onScreeningCreated,
  ] as const,
]

pipe(
  gen(function* (_) {
    for (const [routeHandler, commandHandler, ...eventHandlers] of handlers) {
      for (const eventHandler of eventHandlers) {
        yield* _($EventStore.subscribe(eventHandler))
      }
      yield* _($ServiceBus.registerHandler(commandHandler))
      yield* _(routeHandler)
    }

    yield* _(GetFilms)
    yield* _(GetFilm)

    yield* _(CreateScreen)
    yield* _(EditScreen)
    yield* _(RemoveScreen)
    yield* _(GetScreens)
    yield* _(GetScreen)

    yield* _(GetScreeningsByFilm)

    yield* _($EventStore.run)
    yield* _($ServiceBus.run)
    yield* _($HttpServer.run)
  }),
  Layer.fromRawEffect,
  Layer.using($Layer),
  Layer.launch,
  Effect.runPromise,
)
