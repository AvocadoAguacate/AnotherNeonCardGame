import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router:Router){}
  goConnect() {
    this.router.navigate(['/home/conect']);
  }
  goReConnect() {
    this.router.navigate(['/home/reconect']);
  }
  goAbout() {
    this.router.navigate(['/home/about']);
  }

}
