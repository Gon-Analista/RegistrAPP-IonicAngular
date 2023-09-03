import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {

    path: 'restablecer',
    loadComponent: () => import('./restablecer/restablecer.page').then( m => m.RestablecerPage)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }


];
