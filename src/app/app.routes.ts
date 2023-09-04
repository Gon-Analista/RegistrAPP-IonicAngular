import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'alumno',
    loadComponent: () => import('./alumno/alumno.page').then( m => m.PerfilPage)
  },
  {

    path: 'restablecer',
    loadComponent: () => import('./restablecer/restablecer.page').then( m => m.RestablecerPage)
  },
  {
    path: 'profesor',
    loadComponent: () => import('./profesor/profesor.page').then( m => m.ProfesorPage)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }




];
