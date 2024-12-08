import { ChallengeUI, messageUI, PlayerUI, UpdateUI } from './../interfaces/update.model';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditPlayerMessage, Message, ReadyMessage } from '../interfaces/message.model';
import { CardUI } from '../interfaces/update.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService  {

  private handSubject = new BehaviorSubject<CardUI[]>([]);
  public hand$ = this.handSubject.asObservable();

  private lastDiscardSubject = new BehaviorSubject<CardUI>({colors:[],id:""});
  public lastDiscard$ = this.lastDiscardSubject.asObservable();

  private playersSubject = new BehaviorSubject<PlayerUI[]>([]);
  public players$ = this.playersSubject.asObservable();

  private deadNumberSubject = new BehaviorSubject<number>(25);
  public deadNumber$ = this.deadNumberSubject.asObservable();

  private turnSubject = new BehaviorSubject<number>(0);
  public turn$ = this.turnSubject.asObservable();

  private challengeSubject = new BehaviorSubject<ChallengeUI>(0);
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
}
