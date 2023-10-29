import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('TOKEN'); // Verifica si el token de autenticación está presente en el localStorage.
  
    if (token) {
      return true; // El usuario tiene acceso.
    } else {
      this.router.navigate(['/login']); // Redirige al inicio de sesión si el usuario no está autenticado.
      return false; // El usuario no tiene acceso.
    }
  }
  
}


