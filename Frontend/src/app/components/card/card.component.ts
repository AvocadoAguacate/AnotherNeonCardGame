import { CommonModule } from '@angular/common';
import { CardUI } from './../../interfaces/update.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  constructor(){
  }

  @Input()
  public card!: CardUI
  @Input()
  public isChain!: boolean
  ngOnInit(): void {
    if(!this.card) throw new Error('The card is required');
  }
  private isChainNumber(): boolean{
    if(this.card.number! >= 14 && this.card.number! <= 35) return true;
    return false;
  }

  getSrc():string {
    return `assets/Cards/c${this.card.number!}.svg`;
  }

}
