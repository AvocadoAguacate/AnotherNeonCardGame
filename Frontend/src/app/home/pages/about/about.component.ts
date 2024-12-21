import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardDetailComponent } from "../../../components/card-detail/card-detail.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule, CardDetailComponent, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  public orderArray:number[];
  constructor(){
    this.orderArray = Array.from({ length: 70 }, (_, i) => i);;
    this.orderArray.forEach((_, i) => {
      const j = Math.floor(Math.random() * 10);
      [this.orderArray[i], this.orderArray[j]] = [this.orderArray[j], this.orderArray[i]];
    });
  }
}
