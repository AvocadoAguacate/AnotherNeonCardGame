import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { Color, PlayCardMessage } from '../interfaces/message.model';
import { CardUI } from '../interfaces/update.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private color: Color = 'null';
  private currNumber: number = 0;
  private selectedPlayer = -1;
  private discardCards: string[] = [];
  private id = ""

  constructor(
  ){}

  selectColor(color: Color) {
    this.color = color;
  }

  selectNumber(currNumber: number) {
    this.currNumber = currNumber;
    if(this.currNumber > 100){
      this.currNumber = this.currNumber % 100;
    }
  }

  selectPlayer(playerInd: number) {
    this.selectedPlayer = playerInd;
  }

  getSelectedPlayer(): number {
    return this.selectedPlayer;
  }

  selectDiscards(selectedCards: string[]) {
    this.discardCards = selectedCards;
  }

  getPlayCardMessage(card: CardUI): PlayCardMessage {
    if(card.number > 10){
      let msg: PlayCardMessage = {
        type: 'playCard',
        id: this.id,
        payload: {
          cardId: card.id
        }
      };
      if(card.colors.length === 0){
        if(this.color === 'null'){
          const colors: Color[] = ['blue','red', 'green', 'purple', 'yellow'];
          const indCol = Math.floor(Math.random() * colors.length);
          this.color = colors[indCol];
        }
        msg.payload.wildColor = this.color;
      }
      if(this.needDiscard(card.number)){
        msg.payload.discardCards = this.discardCards;
      }
      if(this.needTarget(card.number)){
        msg.payload.target = this.selectedPlayer;
      }
      return msg;
    } else { // 0 - 9 (no actions)
      return {
        type: "playCard",
        id: this.id,
        payload: {
          cardId: card.id
        }
      }
    }
  }

  needDiscard(cardNum: number): boolean{
    const exep = [10, 11];
    for (let index = 0; index < exep.length; index++) {
      if(exep[index] === cardNum){
        return true;
      }
    }
    return false;
  }

  needTarget(cardNum: number): boolean{
    const exep: number[] = [];
    for (let index = 0; index < exep.length; index++) {
      if(exep[index] === cardNum){
        return true;
      }
    }
    return false;
  }
}
