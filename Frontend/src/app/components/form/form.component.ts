import { avatarPaths } from './../../avatarPaths';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Output()
  public onValue = new EventEmitter<string>();
  
  public optionsPic: number[] = [];
  public avatarPaths = avatarPaths;
  constructor(){
    this.optionsPic = this.chooseRandomPics();
  }

  chooseRandomPics():number[]{
    const selectedAvatars: Set<number> = new Set();
    while (selectedAvatars.size < 3) {
      const randomIndex = Math.floor(Math.random() * avatarPaths.length);
      selectedAvatars.add(randomIndex);
    }
    return Array.from(selectedAvatars); // Convertir el Set a array y devolverlo
  }
}
