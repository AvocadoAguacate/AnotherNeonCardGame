import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Color } from '../../../interfaces/message.model';

@Component({
  selector: 'modal-color',
  standalone: true,
  imports: [],
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss'
})
export class ColorComponent {
  constructor(
    private gameservice: GameService
  ){}

  selectColor(color:Color){
    this.gameservice.selectColor(color);
  }
}
