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

  @Input()
  public card!: CardUI
  @Input()
  public isChain!: boolean
  @Input()
  public isGeneral!: boolean

  public classImg: string = 'main-icon-buttom neon-off';
  public classIcon: string = 'position-absolute chain-icon neon-off';
  
  ngOnInit(): void {
    if(!this.card) throw new Error('The card is required');
    if(this.card.colors.length > 2){
      this.card.colors = [];
    }
    this.getImgClass();
  }

  getSrc():string {
    return `assets/Cards/c${this.card.number!}.svg`;
  }

  getImgClass(): void{
    const place = !this.isChain && !this.isGeneral ? 'main-icon-center' : 'main-icon-buttom';
    const secondColor = this.card.colors.length === 2 ? `-${this.card.colors[1]}`: '';
    const color =  this.card.colors.length >= 1 ? this.card.colors[0] : 'off';
    this.classImg = `${place} neon-${color}${secondColor}`
    if(this.isChain || this.isGeneral){
      this.classIcon = `position-absolute chain-icon neon-${color}${secondColor}`;
    }
  }

}
