import { Injectable } from '@angular/core';
import { LoginReturnCredentials } from 'src/app/types/login-credentials.type';
import { UserLogged, UserReturn } from 'src/app/types/user.type';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private localKeyPrefix: string = '@devameet:';
  constructor() {}

  setKeyPrefix(prefix: string): void {
    this.localKeyPrefix = prefix;
  }

  getLocalKey(key: string): string {
    return `${this.localKeyPrefix}${key}`;
  }

  // Local Storage

  setItem(key: string, value: string): void {
    localStorage.setItem(this.getLocalKey(key), value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.getLocalKey(key));
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getLocalKey(key));
  }

  // Helper Functions
  setLogin(login: LoginReturnCredentials) {
    this.setItem('token', login.token);
    this.setItem('name', login.name);
    this.setItem('email', login.email);
  }

  setLogout() {
    this.removeItem('token');
    this.removeItem('name');
    this.removeItem('email');
    this.removeItem('id');
    this.removeItem('avatar');
  }

  setUser(user: UserReturn) {
    this.setItem('id', user.id);
    if (user.avatar) {
      this.setItem('avatar', user.avatar);
    }
  }

  getUserLogged(): UserLogged {
    return {
      name: this.getItem('name'),
      email: this.getItem('email'),
      id: this.getItem('id'),
      avatar: this.getItem('avatar'),
    } as UserLogged;
  }

  getToken(): string | null {
    return this.getItem('token');
  }
}
