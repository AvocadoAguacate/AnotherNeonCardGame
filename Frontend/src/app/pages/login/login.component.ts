import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { FormComponent } from "../../components/form/form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private _socketService: SocketService){}
  public name: string = '';
  public picIndex: number = Math.floor(Math.random() * 20);
}
