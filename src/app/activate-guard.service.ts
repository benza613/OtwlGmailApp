import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private _authService: AuthService
  ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isAuthenticated()) {
      return true;
    }
    console.log('auth happend');

    // navigate to login page
    this.router.navigate(['']);
    return false;
  }

  canActivateChild() {
    return true;
  }


}

