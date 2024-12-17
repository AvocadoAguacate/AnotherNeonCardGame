import { Injectable } from '@angular/core';
import { Color } from '../interfaces/message.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private color: Color = 'null';
  private currNumber: number = 0;

  selectColor(color: Color) {
    this.color = color;
  }

  selectNumber(currNumber: number) {
    this.currNumber = currNumber;
    if(this.currNumber > 100){
      this.currNumber = this.currNumber % 100;
    }
    console.log(this.currNumber);
  }
}
