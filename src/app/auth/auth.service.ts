import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

//check page for comprehensive auth service
//https://github.com/theo4u/AuthGuard/blob/master/src/app/services/auth.service.ts
export class AuthService {
  private auth_token: string = "";

  constructor(private _router: Router) { }

  /**
  * check for expiration and if token is still existing or not
  * @return {boolean}
  */
  isAuthenticated(): boolean {
    return this.auth_token !== "";
  }

  login(): void {
    this.auth_token = "Allow User";
  }
}