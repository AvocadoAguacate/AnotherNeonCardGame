import { Socket } from "socket.io"
import { Color } from "./card.model"

export type MessageType = 'editPlayer' | 'readyPlayer' | 'playCard' | 'voteDeck' | 'challenge'

export interface Message {
  id       : string,
  type     : MessageType,
  payload  : any,
  socket  ?: Socket
}

export interface ReadyMessage extends Message{
  payload : {
    status: boolean
  }
}

export interface EditPlayerMessage extends Message{
  payload :{
    name ?: string,
    img  ?: number
  },
  socket  : Socket
}

export interface PlayCardMessage extends Message{
  payload :{
    cardId        : string,
    discardCards ?: string[],
    target       ?: string,
    wildColor    ?: Color
  }
}