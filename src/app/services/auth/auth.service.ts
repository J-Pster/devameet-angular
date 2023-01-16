import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LoginCredentials,
  LoginReturnCredentials,
} from 'src/app/types/login-credentials.type';
import { UserService } from '../user/user.service';
import { LocalstorageService } from '../local/localstorage.service';
import { UserLogged } from 'src/app/types/user.type';
import { RegisterReturnCredentials } from 'src/app/types/register-credentials.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject('DEVAMEET_URL_API') private _apiUrl: string,
    private router: Router,
    private userApiService: UserService,
    private localStorageService: LocalstorageService
  ) {
    super(_http, _apiUrl);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response: LoginReturnCredentials = await this.post(
      'auth/login',
      credentials
    );

    console.log('LOGIN RESPONSE: ', response);

    if (!response.token) throw new Error('Token not found!');

    this.localStorageService.setLogin(response);

    const userData = await this.userApiService.getUser();
    this.localStorageService.setUser(userData);

    this.router.navigateByUrl('/');
  }

  async register(form: FormData): Promise<void> {
    const response: RegisterReturnCredentials = await this.post(
      'auth/register',
      form
    );

    if (!response._id) throw new Error('Register Error!');

    await this.login({
      login: form.get('email') as string,
      password: form.get('password') as string,
    });

    this.router.navigateByUrl('/');
  }

  isLogged(): boolean {
    return this.localStorageService.getItem('token') !== null;
  }

  logout(): void {
    this.localStorageService.setLogout();
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return this.localStorageService.getItem('token');
  }

  getUserLogged(): UserLogged {
    return this.localStorageService.getUserLogged();
  }
}
