import { Effect, pipe } from '@effect-ts/core'
import _fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { $Layer } from '../../../config/Layer.local'
import { $Effect } from '../../../src/Effect'
import { $CreateFilm } from './film/command/CreateFilm'
import { $EditFilm } from './film/command/EditFilm'
import { $RemoveFilm } from './film/command/RemoveFilm'
import { $GetFilm } from './film/query/GetFilm'
import { $GetFilms } from './film/query/GetFilms'
import { $CreateScreen } from './screen/command/CreateScreen'
import { $EditScreen } from './screen/command/EditScreen'
import { $RemoveScreen } from './screen/command/RemoveScreen'
import { $GetScreen } from './screen/query/GetScreen'
import { $GetScreens } from './screen/query/GetScreens'

const fastify = _fastify()

fastify.register(fastifyCors)

fastify.addHook('preSerialization', async (_request, _reply, payload) =>
  $Effect.is(payload)
    ? pipe(payload, Effect.provideLayer($Layer), Effect.runPromise)
    : payload,
)

fastify.register($CreateScreen)
fastify.register($GetScreens)
fastify.register($GetScreen)
fastify.register($EditScreen)
fastify.register($RemoveScreen)
fastify.register($CreateFilm)
fastify.register($GetFilms)
fastify.register($GetFilm)
fastify.register($EditFilm)
fastify.register($RemoveFilm)

const start = async () => {
  try {
    await fastify.listen(process.argv[2] ?? 0, '::')
    console.log('server started')
  } catch (error) {
    console.error('server failed', error)
    fastify.log.error(error)
    throw error
  }
}

start()
