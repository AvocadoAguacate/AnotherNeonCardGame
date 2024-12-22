import { CommonModule } from '@angular/common';
import { GameService } from './../../../services/game.service';
import { modalNumber } from './number.model';
import { Component } from '@angular/core';

@Component({
  selector: 'modal-number',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number.component.html',
  styleUrl: './number.component.scss'
})

export class NumberComponent {
  public btnNumbers: modalNumber[] = [
    {number: 0, status: true},
    {number: 1, status: true},
    {number: 2, status: true},
    {number: 3, status: true},
    {number: 4, status: true},
    {number: 5, status: true},
    {number: 6, status: true},
    {number: 7, status: true},
    {number: 8, status: true},
    {number: 9, status: true},
  ];
  public currNumber = 0;


  constructor(
    private gameService: GameService
  ){

  }
  ngOnInit(): void {
    this.buttomSuffle()
  }

  private getStatus(){
    this.btnNumbers.forEach(item => {
      item.status = Math.random() < 0.65 ? true : false;
    })
  }

  private sortNumbers(){
    this.btnNumbers.forEach((_, i) => {
      const j = Math.floor(Math.random() * 10);
      [this.btnNumbers[i], this.btnNumbers[j]] = [this.btnNumbers[j], this.btnNumbers[i]];
    });
  }

  private buttomSuffle(){
    this.getStatus();
    this.sortNumbers();
  }

  public setNumber(num: number){
    this.currNumber *= 10;
    this.currNumber += num;
    this.buttomSuffle();
  }

  public sendNumber(){
    this.buttomSuffle()
    this.gameService.selectNumber(this.currNumber);
    this.currNumber = 0;
  }
}
