import { Color } from "./message.model"


export type TypeUI = 'updateUI' | 'challenge' | 'voteDeck' 

export interface messageUI{
  type: TypeUI
}

export interface UpdateUI extends messageUI{
  lastDiscard   : CardUI,
  hand         ?: CardUI[],
  players      ?: PlayerUI[],
  deadNumber   ?: number,
  turn          : number     
}

export interface CardUI{
  number ?: number,
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