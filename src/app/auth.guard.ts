import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isProfesor = route.data['isProfesor'];
    const token = isProfesor ? localStorage.getItem('TOKEN_PROFESOR') : localStorage.getItem('TOKEN_ALUMNO');

    if (token) {
      localStorage.removeItem('TOKEN_PROFESOR'); 
      localStorage.removeItem('TOKEN_ALUMNO'); 
      return true;
     
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
 

}



