import { avatarPaths } from './../../avatarPaths';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SocketService } from '../../services/socket.service';
import { CardUI, PlayerUI } from '../../interfaces/update.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterModule, FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {


  public hand: CardUI[] = [];
  public lastDiscard: CardUI = {colors:[],id:""};
  public players: PlayerUI[] = [];
  public deadNumber: number = 25;
  public turn: number = -1;

  @Output()
  public onValue = new EventEmitter<string>();
  
  public optionsPic: number[] = [];
  public avatarPaths = avatarPaths;
  public selectedOption: string;

  constructor(private _socketService:SocketService){
    this.optionsPic = this.chooseRandomPics();
    this.selectedOption = "";
  }

  ngOnInit(): void {
    this._socketService.hand$.subscribe((hand) => this.hand = hand);
    this._socketService.lastDiscard$.subscribe((discard) => this.lastDiscard = discard);
    this._socketService.players$.subscribe((players) => this.players = players);
    this._socketService.deadNumber$.subscribe((deadNumber) => this.deadNumber = deadNumber);
    this._socketService.turn$.subscribe((turn) => this.turn = turn);
  }

  chooseRandomPics():number[]{
    const selectedAvatars: Set<number> = new Set();
    while (selectedAvatars.size < 3) {
      const randomIndex = Math.floor(Math.random() * avatarPaths.length);
      selectedAvatars.add(randomIndex);
    }
    return Array.from(selectedAvatars); // Convertir el Set a array y devolverlo
  }

  sendPlayer(name:string, pic:number){
    this._socketService.setPlayer(name, pic);
  }

  parseNumber(value: string): number {
    return parseInt(value, 10); 
  }

  sendReady() {
    this._socketService.setReady(true);
  }

  sendCard(ind: number) {
    let card = this.hand[ind];
    this._socketService.sendCard(
      card.id,
      undefined,
      undefined,
      card.colors.length > 0 ? undefined : 'red'
    );
    }
}
