import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pageToRender: 'login' | 'meet' = 'meet';

  constructor(
    private localStorage: LocalstorageService,
    private userService: UserService
  ) {}

  private async checkToken(): Promise<void> {
    const response = await this.userService.getUser();

    if (!response.id) {
      this.pageToRender = 'login';
      this.localStorage.setLogout();
      return;
    }

    this.pageToRender = 'meet';
  }

  ngOnInit(): void {
    const token = this.localStorage.getToken();

    if (!token) {
      this.pageToRender = 'login';
      this.localStorage.setLogout();
      return;
    }

    this.checkToken();
  }
}
