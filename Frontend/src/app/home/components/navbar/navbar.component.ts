import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public randomName: string = '';
  constructor(
    private router:Router,
    private translate: TranslateService
  ){
    this.getRandomName()
  }
  goMenu() {
    this.getRandomName()
    this.router.navigate(['/home/menu']);
  }
  getRandomName() {
    this.translate.get('APP.NAVBAR.TITLES').subscribe((titles: string[]) => {
      const pickUp = Math.floor(Math.random() * titles.length);
      this.randomName = titles[pickUp];
    });
  }
  selectLan(ev: Event) {
    const selectedLang = (ev.target as HTMLSelectElement).value;
    this.translate.use(selectedLang);
    this.getRandomName();
  }
}
