import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { map, take, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export const loginRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.currentUser$, authService.loading$]).pipe(
    filter(([_, loading]) => !loading),
    take(1),
    map(([user]) => {
      if (user) {
        router.navigate(['/chat']);
        return false;
      }
      return true;
    })
  );
};
