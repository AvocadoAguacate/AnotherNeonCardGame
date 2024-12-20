import { GameService } from './../../../services/game.service';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardUI } from '../../../interfaces/update.model';
import { CardComponent } from "../../card/card.component";

@Component({
  selector: 'modal-discard',
  standalone: true,
  imports: [TranslateModule, CardComponent],
  templateUrl: './discard.component.html',
  styleUrl: './discard.component.scss'
})
export class DiscardComponent {
  @Input()
  public hand!: CardUI[]
  private selectedCards: string[] = []; 

  constructor(
    private game:GameService
  ){}

  onCheckboxChange(event: any, cardId: string) {
    if (event.target.checked) {
      this.selectedCards.push(cardId); 
    } else {
      const index = this.selectedCards.indexOf(cardId);
      if (index > -1) {
        this.selectedCards.splice(index, 1); 
      }
    }
  }

  getSelectedCards() {
    this.game.selectDiscards(this.selectedCards);
  }
}
