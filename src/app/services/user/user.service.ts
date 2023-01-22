import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserPut, UserReturn } from 'src/app/types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject('DEVAMEET_URL_API') private _apiUrl: string
  ) {
    super(_http, _apiUrl);
  }

  getUser(): Promise<UserReturn> {
    return this.get('user');
  }

  updateUser(newUser: UserPut): Promise<any> {
    return this.put('user', newUser);
  }
}
