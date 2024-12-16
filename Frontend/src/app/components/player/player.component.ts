import { Component, Input } from '@angular/core';
import { PlayerUI } from '../../interfaces/update.model';
import { avatarPaths } from '../../avatarPaths';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  public avatarPaths = avatarPaths;

  @Input()
  public player!: PlayerUI
  @Input()
  public deathNumber!: number
  @Input()
  public isTurn!: boolean

  getPlayerImg():string{
    console.log(avatarPaths[this.player.img])
    return avatarPaths[this.player.img];
  }

  getOverlayHeight(): string {
    return `${Math.floor((100 / this.deathNumber) * this.player.hand)}%`;
  }
}
