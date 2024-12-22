import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { CardUI, PlayerUI } from '../../../interfaces/update.model';
import { CardComponent } from "../../../components/card/card.component";
import { PlayerComponent } from '../../../components/player/player.component';
import { PlayerModalComponent } from "../../../components/modals/player/player.component";
import { DiscardComponent } from "../../../components/modals/discard/discard.component";
import { GameService } from '../../../services/game.service';
import { NumberComponent } from "../../../components/modals/number/number.component";
import { ColorComponent } from "../../../components/modals/color/color.component";
import { HelpComponent } from "../../../components/modals/help/help.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    PlayerComponent,
    PlayerModalComponent,
    DiscardComponent,
    NumberComponent,
    ColorComponent,
    HelpComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {


    public hand: CardUI[] = [];
    public lastDiscard: CardUI = {colors:[],id:"", number: -1};
    public players: PlayerUI[] = [];
    public deadNumber: number = 25;
    public turn: number = -1;
    public selectedPlayer: PlayerUI = {name: "", img: 1, hand:-1};
    public selectedInd: number = -1;

    constructor(
      private router:Router,
      private socketService:SocketService,
      private game:GameService
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

    selectPlayer(ind: number) {
      this.selectedInd = ind;
      this.selectedPlayer = this.players[ind];
    }

    sendCard(card: CardUI) {
      this.socketService.sendCard(this.game.getPlayCardMessage(card));
    }

    deal() {
      this.socketService.deal();
    }
}
