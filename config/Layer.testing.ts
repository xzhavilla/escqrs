import { pipe, Queue } from '@effect-ts/core'
import * as Layer from '@effect-ts/system/Layer'
import EventEmitter from 'events'
import fastify from 'fastify'
import _fs from 'fs'
import { fs } from 'memfs'
import { $QueueServiceBus } from '../src/entity/message/command/servicebus/QueueServiceBus'
import { HasServiceBus } from '../src/entity/message/command/servicebus/ServiceBus'
import { HasEventStore } from '../src/entity/message/event/eventstore/EventStore'
import { $InMemoryEventStore } from '../src/entity/message/event/eventstore/InMemoryEventStore'
import { $InMemoryRepository } from '../src/entity/repository/InMemoryRepository'
import { HasRepository } from '../src/entity/repository/Repository'
import { $FastifyHttpServer } from '../src/http/server/FastifyHttpServer'
import { HasHttpServer } from '../src/http/server/HttpServer'
import { HasLogger } from '../src/logger/Logger'
import { $NilLogger } from '../src/logger/NilLogger'
import { $Fs } from '../src/storage/Fs'
import { HasStorage } from '../src/storage/Storage'
import { $Rfc4122Uuid } from '../src/uuid/Rfc4122Uuid'
import { HasUuid } from '../src/uuid/Uuid'

export const $Layer = pipe(
  Layer.all(
    Layer.fromManaged(HasEventStore)(
      $InMemoryEventStore(() => new EventEmitter()),
    ),
    Layer.fromManaged(HasHttpServer)($FastifyHttpServer(fastify)),
    Layer.fromManaged(HasRepository)($InMemoryRepository),
    Layer.fromManaged(HasServiceBus)($QueueServiceBus(Queue.makeSliding(16))),
    Layer.fromValue(HasStorage)($Fs(fs as unknown as typeof _fs)),
    Layer.fromValue(HasUuid)($Rfc4122Uuid),
  ),
  Layer.usingAnd(Layer.fromValue(HasLogger)($NilLogger)),
  Layer.main,
)
