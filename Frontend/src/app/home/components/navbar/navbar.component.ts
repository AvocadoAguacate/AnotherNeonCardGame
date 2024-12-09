import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private names = [
    'Another card game',
    'Simple card game for dummies',
    'Algo ahí con cartas',
    'Un juego de cartas',
    'Card game with neon effects!'
  ]
  public randomName: string = '';
  constructor(private router:Router){
    this.getRandomName()
  }
  goMenu() {
    this.getRandomName()
    this.router.navigate(['/home/menu']);
  }
  getRandomName(){
    const pickUp = Math.floor(Math.random() * this.names.length);
    this.randomName = this.names[pickUp]; 
  }
}
