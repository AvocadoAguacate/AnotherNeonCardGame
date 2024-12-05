import { Context } from "./context.model"

export type CardType = 'add' | 'wild' | 'regular'
export type Color = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'brown'

export interface Card{
  number    ?: number,
  isWild     : boolean,
  isAction   : boolean,
  type       : CardType,
  id         : string,
  playCard  ?: (context: Context) => Context,
  colors    ?: Color[]
}