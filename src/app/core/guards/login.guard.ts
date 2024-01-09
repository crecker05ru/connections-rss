import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const loginService = inject(AuthService);
  const rout = inject(Router);
  if (loginService.isLoggedIn) {
    return true;
  }
  return rout.parseUrl('/signin');
};
