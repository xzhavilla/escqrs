import { Effect, pipe } from '@effect-ts/core'
import { gen } from '@effect-ts/system/Effect'
import * as Layer from '@effect-ts/system/Layer'
import EventEmitter from 'events'
import _fs from 'fs'
import { fs } from 'memfs'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { $Layer } from '../../../../../config/Layer.testing'
import { HasLogger } from '../../../../logger/Logger'
import { $NilLogger } from '../../../../logger/NilLogger'
import { $Fs } from '../../../../storage/Fs'
import { HasStorage } from '../../../../storage/Storage'
import { Body } from '../../../Entity'
import { $Event, Event } from '../Event'
import { $EventHandler } from '../EventHandler'
import { $EventStore, HasEventStore } from './EventStore'
import { $InMemoryEventStore } from './InMemoryEventStore'
import { $StorageEventStore } from './StorageEventStore'

describe('EventStore', () => {
  describe.each([
    [
      'InMemoryEventStore',
      () =>
        pipe(
          $Layer,
          Layer.and(
            Layer.fromManaged(HasEventStore)(
              $InMemoryEventStore(() => new EventEmitter()),
            ),
          ),
          Layer.using(Layer.fromValue(HasLogger)($NilLogger)),
          Layer.main,
        ),
    ],
    [
      'StorageEventStore',
      (seed: number) =>
        pipe(
          $Layer,
          Layer.and(
            Layer.fromManaged(HasEventStore)(
              $StorageEventStore(
                resolve(tmpdir(), `eventstore.${seed}`),
                () => new EventEmitter(),
              ),
            ),
          ),
          Layer.using(Layer.fromValue(HasLogger)($NilLogger)),
          Layer.using(
            Layer.fromValue(HasStorage)($Fs(fs as unknown as typeof _fs)),
          ),
          Layer.main,
        ),
    ],
  ])('%s', (_, layer) => {
    let seed = -1
    let bar: number

    beforeEach(() => {
      seed++
      bar = 0
    })

    test('handling an event', async () => {
      await expect(
        pipe(
          gen(function* (_) {
            const handler = $EventHandler(
              'foo',
              'bar',
            )((event) =>
              Effect.succeedWith(() => {
                bar += (event as any).bar
              }),
            )
            yield* _($EventStore.subscribe(handler))
            const event = yield* _(
              $Event('foo')({ aggregateId: 'bar', bar: 42 } as Body<Event>)(),
            )
            yield* _($EventStore.run)

            return yield* _($EventStore.publish(event))
          }),
          Effect.provideSomeLayer(layer(seed)),
          Effect.runPromise,
        ).then(() => bar),
      ).resolves.toBe(42)
    })
    test('subscribing multiple handlers to the same event', async () => {
      await expect(
        pipe(
          gen(function* (_) {
            const handlers = [
              $EventHandler(
                'foo',
                'bar',
              )((event) =>
                Effect.succeedWith(() => {
                  bar += (event as any).bar
                }),
              ),
              $EventHandler(
                'foo',
                'bar',
              )((event) =>
                Effect.succeedWith(() => {
                  bar -= 2 * (event as any).bar
                }),
              ),
            ]
            for (const handler of handlers) {
              yield* _($EventStore.subscribe(handler))
            }
            const event = yield* _(
              $Event('foo')({ aggregateId: 'bar', bar: 42 } as Body<Event>)(),
            )
            yield* _($EventStore.run)

            return yield* _($EventStore.publish(event))
          }),
          Effect.provideSomeLayer(layer(seed)),
          Effect.runPromise,
        ).then(() => bar),
      ).resolves.toBe(42 - 42 * 2)
    })
    test('restarting the event store', async () => {
      await pipe(
        gen(function* (_) {
          const handler = $EventHandler(
            'foo',
            'bar',
          )((event) =>
            Effect.succeedWith(() => {
              bar += (event as any).bar
            }),
          )
          yield* _($EventStore.subscribe(handler))
          const event = yield* _(
            $Event('foo')({ aggregateId: 'bar', bar: 42 } as Body<Event>)(),
          )
          yield* _($EventStore.run)
          yield* _($EventStore.publish(event))
        }),
        Effect.provideSomeLayer(layer(seed)),
        Effect.runPromise,
      )

      await expect(
        pipe(
          gen(function* (_) {
            const handler = $EventHandler(
              'foo',
              'bar',
            )((event) =>
              Effect.succeedWith(() => {
                bar += (event as any).bar
              }),
            )
            yield* _($EventStore.subscribe(handler))

            return yield* _($EventStore.run)
          }),
          Effect.provideSomeLayer(layer(seed)),
          Effect.runPromise,
        ).then(() => bar),
      ).resolves.toBe(42)
    })
  })
})
