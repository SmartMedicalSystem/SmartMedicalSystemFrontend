import { CanActivateFn } from '@angular/router';

export const laboratoryGuard: CanActivateFn = (route, state) => {
  return true;
};
