import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    protected http: HttpClient,
    @Inject('DEVAMEET_URL_API') private apiUrl: string
  ) {}

  private getUrl(url: string): string {
    return `${this.apiUrl}/${url}`;
  }

  public post(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public put(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.getUrl(url)).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }
}
