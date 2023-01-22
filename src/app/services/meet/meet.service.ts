import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { HttpClient } from '@angular/common/http';
import { Meet, MeetPost, MeetPut } from 'src/app/types/meet.type';

@Injectable({
  providedIn: 'root',
})
export class MeetService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject('DEVAMEET_URL_API') private _apiUrl: string
  ) {
    super(_http, _apiUrl);
  }

  getMeets(): Promise<Meet[]> {
    return this.get('meet');
  }

  getMeet(id: string): Promise<Meet> {
    return this.get(`meet/${id}`);
  }

  getMeetObjects(id: string): Promise<any> {
    return this.get(`meet/objects/${id}`);
  }

  deleteMeet(id: string): Promise<void> {
    return this.delete(`meet/${id}`);
  }

  createMeet(meet: MeetPost): Promise<void> {
    return this.post('meet', meet);
  }

  updateMeet(id: string, meet: MeetPut): Promise<void> {
    return this.put(`meet/${id}`, meet);
  }
}
