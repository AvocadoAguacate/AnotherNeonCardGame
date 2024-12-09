import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GameComponent } from './pages/game/game.component';
import { HomeLayoutComponent } from './home/pages/home-layout/home-layout.component';
import { HomeComponent } from './home/pages/home/home.component';
import { ConectComponent } from './home/pages/conect/conect.component';
import { ReconectComponent } from './home/pages/reconect/reconect.component';
import { AboutComponent } from './home/pages/about/about.component';

export const routes: Routes = [
  {
    path: 'home', 
    component: HomeLayoutComponent,
    children: [
      {path: 'menu', component:HomeComponent},
      {path: 'conect', component:ConectComponent},
      {path: 'reconect', component:ReconectComponent},
      {path: 'about', component:AboutComponent},
      {path: '**', redirectTo: 'menu'}
    ]
  },
  {path: 'game', component: GameComponent},
  {path: 'test', component: LoginComponent},
  {path: '**', redirectTo: 'home'},
  {path: '**/**', redirectTo: 'home'},

];
