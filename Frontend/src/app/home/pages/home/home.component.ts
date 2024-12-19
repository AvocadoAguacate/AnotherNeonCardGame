import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private router:Router,
  ){

  }
  goConnect() {
    this.router.navigate(['/home/conect']);
  }
  goReConnect() {
    this.router.navigate(['/home/reconect']);
  }
  goAbout() {
    this.router.navigate(['/home/about']);
  }

  enterFullScreen() {
    const doc: any = document.documentElement; // Obtener el elemento raíz del documento
    if (doc.requestFullscreen) {
      doc.requestFullscreen(); // Chrome, Firefox, Opera
    } else if (doc.mozRequestFullScreen) { // Firefox
      doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) { // Chrome, Safari
      doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) { // Internet Explorer/Edge
      doc.msRequestFullscreen();
    }
  }

}
