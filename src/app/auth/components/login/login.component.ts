import { Component } from '@angular/core';
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string = 'undefined Message'

  constructor(public authService: AuthService) {
  }

  login() {
    this.authService.login()
    this.message = "Logged IN"
  }

  get access_token() {
    return localStorage.getItem("accessToken")
  }
}
