import { Context } from "./context.model"

export type CardType = 'wild' | 'regular' | 'chain'
export type Color = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'brown' | 'None'

export interface Card{
  number     : number,
  isWild     : boolean,
  isAction   : boolean,
  type       : CardType,
  id         : string,
  playCard  ?: (context: Context, payLoad ?: PlayPayload) => Context,
  colors    ?: Color[]
}

export interface PlayPayload {
  discardCards ?: string[],
  target       ?: number,
  wildColor    ?: Color,
  number       ?: number
}