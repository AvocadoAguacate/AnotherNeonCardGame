import { Component, Input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardUI } from '../../interfaces/update.model';
import { Color } from '../../interfaces/message.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CardComponent, TranslateModule, CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss'
})
export class CardDetailComponent {

  public cardDetail = '';
  public card:CardUI = {
    number: 0,
    id: '',
    colors: []
  };
  public isDescription = false;
  public isFakeDescription = false;
  public isFail = false;

  @Input()
  public isRandom!:boolean;
  @Input()
  public cardNumber!: number;

  constructor(
    private translate: TranslateService
  ){

  }
  ngOnInit(): void {
    const val = this.isRandom ? Math.random() : 0;
    if(val <= 0.4){
      this.isDescription = true;
      this.isFakeDescription = false;
      this.isFail = false;
    } else {
      this.isDescription = false;
      if(val <= 0.7){
        this.isFakeDescription = true;
        this.isFail = false;
      } else{
        this.isFakeDescription = false;
        this.isFail = true;
      }
    }
    const colors = [
      ['blue'], ['red'], ['purple'], ['yellow'], ['green'],
      ['blue', 'red'], ['blue', 'purple'], ['blue', 'green'],
      ['yellow', 'red'], ['yellow', 'purple'], ['yellow', 'green'],
      ['green', 'red'], ['green', 'purple'], ['green', 'blue'],
      ['red', 'blue'], ['red', 'purple'], ['red', 'green'],
    ];
    let rInd = Math.floor(Math.random() * colors.length);
    this.card = {
      number: this.cardNumber,
      colors: colors[rInd] as Color[],
      id: 'UniqueId'
    }
  }

  isChain(num: number): boolean {
    if(num >= 14 && num <= 35) return true;
    return false;
  }
}
