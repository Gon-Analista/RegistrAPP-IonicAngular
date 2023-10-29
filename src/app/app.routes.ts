import { Routes } from '@angular/router';
import { AuthGuard} from './auth.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'alumno',
    loadComponent: () => import('./alumno/alumno.page').then( m => m.PerfilPage),canActivate: [AuthGuard]
  },
  {

    path: 'restablecer',
    loadComponent: () => import('./restablecer/restablecer.page').then( m => m.RestablecerPage)
  },
  {
    path: 'profesor',
    loadComponent: () => import('./profesor/profesor.page').then( m => m.ProfesorPage),canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }




];
