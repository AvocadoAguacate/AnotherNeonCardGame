import { Socket } from 'socket.io';
import { Card } from "./card.model"

export interface Context {
  players         : Player[],
  deck            : Card[],
  discardDeck     : Card[],
  turn            : number,
  direction       : number,
  chain           : Chain,
  deadlyCounter   : DeadlyCounter
}

export interface DeadlyCounter{
  turns           : number,
  deadNumber      : number,
  speed           : number
}

export interface Player{
  id              : string,
  name            : string,
  hand            : Card[],
  img             : number,
  socket          : Socket,
  luckytries      : number,
}

export interface Chain{
  sum             : number,
  members         : boolean[],
}

export interface Challenge{
  id              : string,
  oponent         : string,
  challenger      : string
}