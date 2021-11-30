import { Branded } from '@effect-ts/core'
import { Type } from './Entity'
import { $Message, Message } from './Message'

export interface Command<T extends string = string, I extends string = string>
  extends Branded.Branded<Message<T, I>, 'Event'> {}

export function $Command<A extends Command>(type: Type<A>) {
  return $Message(type)
}
