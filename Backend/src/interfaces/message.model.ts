export type MessageType = 'editPlayer' | 'readyPlayer' | 'play' | 'voteDeck' | 'challenge'

export interface Message {
  id: string,
  type: MessageType,
  payload: any
}

export interface readyMessage extends Message{
  payload: {
    status: boolean
  }
}