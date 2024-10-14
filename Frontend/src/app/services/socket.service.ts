import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { card } from '../interfaces/card.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService  {

  public playerAccepted$ = new BehaviorSubject<boolean>(false);
  public isGameStarted$ = new BehaviorSubject<boolean>(false);
  public hand: card[] = [];

  constructor(private socket: Socket) {
    
  }
  
  listenForUserAcceptance() {
    this.socket.on('setPlayer', (data: any) => {
      if(data.playerAdded){
        this.playerAccepted$.next(true);
        if(data.isGameStarted){
          this.isGameStarted$.next(true)
        }
      }
    });
  }

  getHand(){
    this.socket.on('hand', (msg: card[]) => {
      this.hand = msg;
    });
  }
  

  setReady(status: boolean) {
    this.send('ready', {playerId: this.socket.ioSocket.id, status});
  }

  setPlayer(name:string, picIndex:number){
    this.send('setPlayer', {id: this.socket.ioSocket.id, picIndex, name});
  }

  send(chanel:string, msg:any) {
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
