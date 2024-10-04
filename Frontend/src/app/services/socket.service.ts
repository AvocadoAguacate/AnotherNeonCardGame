import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { card } from '../interfaces/card.models';

@Injectable({
  providedIn: 'root'
})
export class SocketService  {

  constructor(private socket: Socket) {
    
  }
  public hand: card[] = [];
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
