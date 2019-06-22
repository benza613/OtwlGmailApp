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
    if (location.href.toLowerCase().trim().includes('q=')) {
      this.router.navigate(['']);
      return false;
    }
  }

  canActivateChild() {
    return true;
  }


}

