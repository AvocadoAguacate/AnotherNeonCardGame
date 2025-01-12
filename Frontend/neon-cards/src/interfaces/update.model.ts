import { Color } from "./message.model"


export type TypeUI = 'updateUI' | 'challenge' | 'voteDeck' | 'chat'

export interface messageUI{
  type: TypeUI
}

export interface chatMessage extends messageUI{
  players:  number[],
  case:     number,
  values:   number[]
}

export interface UpdateUI extends messageUI{
  lastDiscard  ?: CardUI,
  hand         ?: CardUI[],
  players      ?: PlayerUI[],
  deadNumber   ?: number,
  turn         ?: number,
  chain        ?: number,
  general      ?: number[]    
}

export interface CardUI{
  number  : number,
  colors  : Color[],
  id      : string
}

export interface PlayerUI{
  name    : string,
  hand    : number,
  img     : number
}

export interface ChallengeUI extends messageUI{
  oponent : number,
  id      : string
}