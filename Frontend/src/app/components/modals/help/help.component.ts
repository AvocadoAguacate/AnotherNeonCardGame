import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardUI } from '../../../interfaces/update.model';
import { CardDetailComponent } from "../../card-detail/card-detail.component";

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, CardDetailComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  @Input()
  public hand!: CardUI[]
}
