import { Component } from '@angular/core';
import { CardDetailComponent } from "../card-detail/card-detail.component";
import { SocketService } from '../../services/socket.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-card-vote',
  standalone: true,
  imports: [CardDetailComponent],
  templateUrl: './card-vote.component.html',
  styleUrl: './card-vote.component.scss'
})
export class CardVoteComponent {
  public number: number;
  constructor(
    private socket:SocketService,
    private game: GameService
  ){
    this.number = game.getVote();
  }

  public vote(like: boolean){
    this.socket.sendVote(this.game.getVoteMessage(like, this.number));
    this.number = this.game.getVote();
  }
}
