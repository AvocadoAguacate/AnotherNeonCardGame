export type Color = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'brown' | 'null'
export type MessageType = 'editPlayer' | 'readyPlayer' | 'playCard' | 'voteDeck' | 'challenge' | 'luckTry' | 'deal' | 'pass' | 'logOut'

export interface Message {
  id       : string,
  type     : MessageType,
  payload  : any
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
  }
}

export interface PlayCardMessage extends Message{
  payload :{
    cardId        : string,
    discardCards ?: string[],
    target       ?: number,
    wildColor    ?: Color,
    number       ?: number
  }
}

export interface ChallengeMessage extends Message{
  payload :{
    oponentInd     ?: number,
    challengerId   ?: string,
    id             ?: string,
  }
}

export interface LuckTryMessage extends Message{
  payload :{
    number          : number,
    isOdd           : boolean
  }
}

export interface VoteMessage extends Message{
  payload :{
    id              : number,
    isLiked         : boolean
  }
}