import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ActivateGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router
  ) { }


  canActivate() {
    if (location.href.toLowerCase().trim().includes('mapped') || location.href.toLowerCase().trim().includes('unread')){
      this.router.navigate(['']);
      alert('Navigation Not Allowed');
      return false;
    }
  }

  canActivateChild() {
    return true;
  }


}

