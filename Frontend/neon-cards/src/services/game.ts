import { EditPlayerMessage, Message, ReadyMessage } from "../interfaces/message.model";

export class GameService {
  private picInd: number
  private name: string 
  constructor(){
    this.picInd = -1;
    this.name = "";
  }

  public getEditPlayerMsg(name: string, pic: number):EditPlayerMessage{
    this.picInd = pic;
    this.name = name;
    return {
      id: "",
      type: 'editPlayer',
      payload: {
        name,
        img: pic
      }
    }
  }

  public getReadyPlayerMsg(status: boolean):ReadyMessage{
    return {
      id: "",
      type: 'readyPlayer',
      payload: {
        status
      }
    }
  }

  public getLogOutMsg():Message{
    return {
      id: "",
      type: 'logOut',
      payload: ''
    }
  }
}