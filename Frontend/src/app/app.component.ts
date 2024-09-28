import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private _socketService: SocketService){}
  connect() {
    console.log('try to connect');
    this._socketService.tryConnect();
  }
  send(){
    console.log('try to send something');
    this._socketService.send();
  }
  title = 'Frontend';
}
