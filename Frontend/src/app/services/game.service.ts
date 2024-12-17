import { Injectable } from '@angular/core';
import { Color } from '../interfaces/message.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private color: Color = 'null';


  selectColor(color: Color) {
    this.color = color;
    console.log(this.color)
  }
}
