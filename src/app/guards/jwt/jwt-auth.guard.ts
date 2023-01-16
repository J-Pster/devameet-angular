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

  private async checkToken(): Promise<boolean | UrlTree> {
    try {
      const response = await this.userService.getUser();
      console.log('JWT AUTH GUARD!', response);

      if (!response.id) {
        this.localStorage.setLogout();
        return this.router.parseUrl('/');
      }

      return true;
    } catch (error) {
      return this.router.parseUrl('/');
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.localStorage.getToken();
    if (!token) {
      return this.router.parseUrl('/');
    }

    return true;
  }
}
