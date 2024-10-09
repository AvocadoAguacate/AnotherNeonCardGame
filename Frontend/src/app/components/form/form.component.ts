import { avatarPaths } from './../../avatarPaths';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterModule, FormsModule, AngularSvgIconModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Output()
  public onValue = new EventEmitter<string>();
  
  public optionsPic: number[] = [];
  public avatarPaths = avatarPaths;
  public selectedOption: string;

  constructor(){
    this.optionsPic = this.chooseRandomPics();
    this.selectedOption = "";
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
