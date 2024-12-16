import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { CardUI, PlayerUI } from '../../../interfaces/update.model';
import { CardComponent } from "../../../components/card/card.component";
import { PlayerComponent } from '../../../components/player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, CardComponent, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

    public hand: CardUI[] = [];
    public lastDiscard: CardUI = {colors:[],id:"", number: -1};
    public players: PlayerUI[] = [];
    public deadNumber: number = 25;
    public turn: number = -1;

    constructor(
      private router:Router,
      private socketService:SocketService
    ){}
    ngOnInit(): void {
      this.socketService.hand$.subscribe((hand) => this.hand = hand);
      this.socketService.lastDiscard$.subscribe((discard) => this.lastDiscard = discard);
      this.socketService.players$.subscribe((players) => this.players = players);
      this.socketService.deadNumber$.subscribe((deadNumber) => this.deadNumber = deadNumber);
      this.socketService.turn$.subscribe((turn) => this.turn = turn);
    }

    isGenral(num: number): boolean {
      switch (num) {
        case 60:
          return true;
        case 61:
          return true;
        case 62:
          return true;
        default:
          return false;
      }
    }
    isChain(num: number): boolean {
      if(num >= 14 && num <= 35) return true;
      return false;
    }
}
