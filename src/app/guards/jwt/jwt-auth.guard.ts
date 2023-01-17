import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class JwtAuthGuard implements CanActivate {
  constructor(
    private localStorage: LocalstorageService,
    private userService: UserService,
    private router: Router
  ) {}

  private checkToken(): Promise<boolean | UrlTree> {
    return this.userService
      .getUser()
      .then((response) => {
        if (!response.id) {
          this.localStorage.setLogout();
          return this.router.parseUrl('/');
        }

        return true;
      })
      .catch((error) => {
        this.localStorage.setLogout();
        return this.router.parseUrl('/');
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // ESSE AUTH GUARD NUNCA PODE SER USADO NA ROTA '/', SE FOR USADO, ELE CAUSARÁ UM LOOP QUE CONGELARÁ O CARREGAMENTO

    const token = this.localStorage.getToken();
    if (!token) {
      return this.router.parseUrl('/');
    }

    return this.checkToken();
  }
}
