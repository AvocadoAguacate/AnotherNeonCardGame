import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-waiting',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.scss'
})
export class WaitingComponent {
  constructor(
    private socketService: SocketService,
    private router: Router
  ){}
  public status: boolean = false;
  public turn: number = -1;

  ngOnInit(): void {
    this.socketService.turn$.subscribe((turn) => {
      this.turn = turn
      console.log(this.turn);
      if(this.turn !== -1){
        this.router.navigate(['/game']);
      }
    });
  }

  changeStatus(){
    this.status = !this.status;
  }
  sendReady() {
    this.changeStatus()
    this.socketService.setReady(this.status);
  }
}
