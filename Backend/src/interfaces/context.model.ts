import { Socket } from 'socket.io';
import { Card } from "./card.model"

export interface Context {
  players         : Player[],
  deck            : Card[],
  discardDeck     : Card[],
  turn            : number,
  direction       : number,
  chain           : Chain
}

export interface Player{
  id              : string,
  name            : string,
  hand            : Card[],
  img             : number,
  socket          : Socket
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