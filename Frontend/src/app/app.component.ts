import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private _socketService: SocketService,
    private translate: TranslateService
  ){
    this.translate.addLangs(['es', 'en', 'fr']);
    this.translate.setDefaultLang('es');
  }
}
