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

}
