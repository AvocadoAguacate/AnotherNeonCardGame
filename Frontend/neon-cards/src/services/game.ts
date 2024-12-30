import { EditPlayerMessage } from "../interfaces/message.model";

export class GameService {
  private picInd: number
  private name: string 
  constructor(){
    this.picInd = -1;
    this.name = "";
  }

  public getEditPlayerMsg(name: string, pic: number):EditPlayerMessage{
    return {
      id: "",
      type: 'editPlayer',
      payload: {
        name,
        img: pic
      }
    }
  }
}