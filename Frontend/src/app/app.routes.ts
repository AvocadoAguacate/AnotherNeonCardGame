import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'game', component: GameComponent},
  {path: '**', redirectTo: 'login'},
  {path: '**/**', redirectTo: 'login'},
];
