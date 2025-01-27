import { GameService } from './game.service';
import { ChallengeMessage, VoteMessage } from './../interfaces/message.model';
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

  constructor(
    private socket: Socket,
    private gameService: GameService
  ) {
    this.listenToServer();
  }
  
  listenToServer(): void {
    this.socket.fromEvent<any>('message').subscribe( (data:messageUI) => {
      switch (data.type) {
        case "updateUI":
          let update:UpdateUI = data as UpdateUI;
          console.log(update);
          if (update.turn !== undefined && update.turn !== null) {
            this.turnSubject.next(update.turn);
            console.log(update.turn!);
          }
          if(update.lastDiscard){
            this.lastDiscardSubject.next(update.lastDiscard);
          }
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
    this.playerData = {
      id: this.socket.ioSocket.id,
      img: picIndex,
      name
    };
    this.saveData(this.playerData);
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

  sendCard(msg: PlayCardMessage) {
    msg.id = this.playerData.id;
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

  sendChallenge() {
    const oponentInd = this.gameService.getSelectedPlayer();
    const msg: ChallengeMessage = {
      id: this.playerData.id,
      type: 'challenge',
      payload: {
        oponentInd,
        challengerId: this.playerData.id
      }
    }
    console.log(msg);
    this.send('message', msg);
  }

  getId(): string{
    return this.playerData.id;
  }

  deal(){
    let msg: Message = {
      id: this.playerData.id,
      type: 'deal',
      payload: {}
    }
    this.send('message',msg);
  }

  pass(){
    let msg: Message = {
      id: this.playerData.id,
      type: 'pass',
      payload: {}
    }
    this.send('message',msg);
  }

  sendVote(msg: VoteMessage) {
    msg.id = this.playerData.id;
    this.send('message', msg);
  }

  sendLogOut(){
    let msg: Message = {
      id: this.playerData.id,
      type: 'logOut',
      payload: ''
    }
    this.send('message', msg);
  }
}
