﻿import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators'
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.isAuthenticated.value;
    if (currentUser) {

      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
