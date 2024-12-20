import { Component, Input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { TranslateService } from '@ngx-translate/core';
import { CardUI } from '../../interfaces/update.model';
import { Color } from '../../interfaces/message.model';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss'
})
export class CardDetailComponent {

  public cardTitle = '';
  public cardDetail = '';
  public card:CardUI = {
    number: 0,
    id: '',
    colors: []
  };

  @Input()
  public isRandom!:boolean;
  @Input()
  public cardNumber!: number;

  constructor(
    private translate: TranslateService
  ){

  }
  ngOnInit(): void {
    let key = `CARDS.C${this.cardNumber}`;
    this.translate.get(key)
      .subscribe((data) => {
        this.cardTitle = data!.NAME;
        const val = this.isRandom ? Math.random() : 0;
        if(val <= 0.4){
          this.cardDetail = data!.DESCRIPTION;
        } else {
          if(val <= 0.7){
            this.cardDetail = data!.FAKEDESCRIPTION
          } else{
            this.translate.get('CARDS.FAIL')
              .subscribe((fail: string) => {
                this.cardDetail = fail;
              });
          }
        }
      });
    const colors = [
      ['blue'], ['red'], ['purple'], ['yellow'], ['green'],
      ['blue', 'red'], ['blue', 'purple'], ['blue', 'green'],
      ['yellow', 'red'], ['yellow', 'purple'], ['yellow', 'green'],
      ['green', 'red'], ['green', 'purple'], ['green', 'blue'],
      ['red', 'blue'], ['red', 'purple'], ['red', 'green'],
    ];
    let rInd = Math.floor(Math.random() * colors.length);
    if(this.cardNumber === 38 || this.cardNumber === 37) {
      this.cardNumber = Math.floor(Math.random() * 10);
      rInd = -1;
    }
    this.card = {
      number: this.cardNumber,
      colors: rInd >= 0 ? colors[rInd] as Color[]: [],
      id: 'UniqueId'
    }
    console.log(this.card)
  }
}
