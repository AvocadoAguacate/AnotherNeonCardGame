import { avatarPaths } from './../../../avatarPaths';
import { PlayerUI } from '../../../interfaces/update.model';
import { SocketService } from '../../../services/socket.service';
import { GameService } from './../../../services/game.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerModalComponent {
  constructor(
    private gameService:GameService,
    private socketService:SocketService
  ){}

  @Input()
  public player!: PlayerUI
  @Input()
  public playerInd!: number

  public avatarPaths: string[] =  avatarPaths;

  selectPlayer() {
    this.gameService.selectPlayer(this.playerInd);
  }

  sendChallenge() {
    this.gameService.selectPlayer(this.playerInd);
    this.socketService.sendChallenge();
  }

}
