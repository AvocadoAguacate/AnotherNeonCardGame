import { Socket } from "socket.io"

export type MessageType = 'editPlayer' | 'readyPlayer' | 'play' | 'voteDeck' | 'challenge'

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