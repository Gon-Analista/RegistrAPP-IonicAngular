import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';


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
    loadComponent: () => import('./profesor/profesor.page').then( m => m.ProfesorPage),canActivate: [AuthGuard],data: { isProfesor: true } 
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },  {
    path: 'modal-page',
    loadComponent: () => import('./modal-page/modal-page.page').then( m => m.ModalPagePage)
  }





];
