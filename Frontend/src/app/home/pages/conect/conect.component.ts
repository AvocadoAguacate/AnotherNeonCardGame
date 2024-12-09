
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { avatarPaths } from '../../../avatarPaths';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-conect',
  standalone: true,
  imports: [RouterModule, FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './conect.component.html',
  styleUrl: './conect.component.scss'
})
export class ConectComponent {
  public optionsPic: number[] = [];
  public avatarPaths = avatarPaths;
  public selectedOption: string;

  constructor(
    private _socketService:SocketService,
    private router:Router
  ){
    this.optionsPic = this.chooseRandomPics();
    this.selectedOption = "";
  }

  private chooseRandomPics():number[]{
    const selectedAvatars: Set<number> = new Set();
    while (selectedAvatars.size < 3) {
      const randomIndex = Math.floor(Math.random() * avatarPaths.length);
      selectedAvatars.add(randomIndex);
    }
    return Array.from(selectedAvatars); // Convertir el Set a array y devolverlo
  }

  sendPlayer(name:string, pic:number){
    if(name.length > 0 && pic >= 0){
      this._socketService.setPlayer(name, pic);
      this.router.navigate(['/test']);
    } else {
      window.location.reload();
    }
  }

  parseNumber(value: string): number {
    return parseInt(value, 10); 
  }
}
