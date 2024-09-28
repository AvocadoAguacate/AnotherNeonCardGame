import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService  {

  constructor(private socket: Socket) {
  }
  getMessage(){
    this.socket.on('hand', (msg: any) => {
      console.log(msg);
    });
  }
  send() {
    this.socket.emit('chat message', {test: 'soy un test', id: this.socket.ioSocket.id});
  }
  tryConnect(){
    this.socket.connect((res) => {
      console.log(res);
    });
  }

  updateSocketUrl(newUrl: string) {
    this.socket.disconnect();
    this.socket.ioSocket.io.uri = newUrl;
    this.socket.connect();
  }
}
