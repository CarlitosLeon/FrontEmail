import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpirado()) {
        this.authService.logout();
        this.router.navigate(['/']);
        return false;
      }

      let rol = next.data['rol'] as string[];

      let hasRoleJH=false;
      rol.forEach(h => {
        if (this.authService.hasRole(h)) {
          hasRoleJH = true;
        }
      })
      if(hasRoleJH){return true}
      
      this.router.navigate(['/']);

      return false;


    }

    this.router.navigate(['/']);
    return false;

  }

  isTokenExpirado() {
    let token = this.authService.token;
    let payload = this.authService.dataToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
