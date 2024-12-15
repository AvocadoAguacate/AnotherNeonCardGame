import { ChallengeUI, messageUI, PlayerUI, UpdateUI } from './../interfaces/update.model';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color, EditPlayerMessage, Message, PlayCardMessage, ReadyMessage } from '../interfaces/message.model';
import { CardUI } from '../interfaces/update.model';
import { PlayerData } from '../interfaces/player.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService  {
  private playerData:PlayerData = {
    id: '',
    name: '',
    img: -1
  }

  private handSubject = new BehaviorSubject<CardUI[]>([]);
  public hand$ = this.handSubject.asObservable();

  private lastDiscardSubject = new BehaviorSubject<CardUI>({colors:[],id:"", number: -1});
  public lastDiscard$ = this.lastDiscardSubject.asObservable();

  private playersSubject = new BehaviorSubject<PlayerUI[]>([]);
  public players$ = this.playersSubject.asObservable();

  private deadNumberSubject = new BehaviorSubject<number>(25);
  public deadNumber$ = this.deadNumberSubject.asObservable();

  private turnSubject = new BehaviorSubject<number>(-1);
  public turn$ = this.turnSubject.asObservable();

  private challengeSubject = new BehaviorSubject<ChallengeUI>({oponent:-1, id:'', type:'challenge'});
  public challenge$ = this.challengeSubject.asObservable();

  constructor(private socket: Socket) {
    this.listenToServer();
  }
  
  listenToServer(): void {
    this.socket.fromEvent<any>('message').subscribe( (data:messageUI) => {
      switch (data.type) {
        case "updateUI":
          let update:UpdateUI = data as UpdateUI;
          this.turnSubject.next(update.turn);
          this.lastDiscardSubject.next(update.lastDiscard);
          if(update.hand){
            this.handSubject.next(update.hand);
          }
          if(update.deadNumber){
            this.deadNumberSubject.next(update.deadNumber);
          }
          if(update.players){
            this.playersSubject.next(update.players);
          }
          break;
        case "challenge":
          let challenge = data as ChallengeUI;
          this.challengeSubject.next(challenge);
          break;
        case "voteDeck":
          break;
        default:
          break;
      }
    });
  }

  setReady(status: boolean) {
    const msg:ReadyMessage = {
      id: this.socket.ioSocket.id, 
      type: "readyPlayer",
      payload: {
        status
      }
    }
    this.send('message', msg);
  }

  setPlayer(name:string, picIndex:number){
    const msg: EditPlayerMessage = {
      id: this.socket.ioSocket.id,
      type: "editPlayer",
      payload:{
        img:picIndex, 
        name
      }
    }
    this.send('message', msg);
    this.saveData({
      id: this.socket.ioSocket.id,
      img: picIndex,
      name
    });
  }

  send(chanel:string, msg:Message) {
    this.socket.emit(chanel, msg);
  }
  
  tryConnect(){
    this.socket.connect((res) => {
      console.log(res);
    });
  }

  updateSocketUrl(newUrl: string, name: string) {
    this.socket.disconnect();
    this.socket.ioSocket.io.uri = newUrl;
    this.socket.connect(res => {
      console.log(res);
    });
    this.socket.emit('chat message', {name, id: this.socket.ioSocket.id});
  }

  sendCard(cardId: string, discardCards: string[] = [], target: number = -1, wildColor: Color = 'null') {
    const msg: PlayCardMessage ={
      type: "playCard",
      id: this.socket.ioSocket.id,
      payload: {
        cardId
      }
    };
    if(discardCards.length > 0){
      msg.payload.discardCards = discardCards;
    }
    if(target >= 0){
      msg.payload.target = target;
    }
    if(wildColor !== 'null'){
      msg.payload.wildColor = wildColor;
    }
    console.log(msg);
    this.send('message',msg);
  }

  private saveData(data: PlayerData): void {
    localStorage.setItem('playerDataMUGG', JSON.stringify(data));
  }

  public loadData(): boolean {
    const data = localStorage.getItem('playerDataMUGG');
    if (data) {
      this.playerData = JSON.parse(data);
      // TODO send change sockect to server
      return true;
    } else {
      return false;
    }
  }
}
