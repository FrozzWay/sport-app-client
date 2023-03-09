import { Injectable } from '@angular/core';
import { AuthService as ApiAuthService } from '../../ApiModule'
import * as models from '../../ApiModule/model/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public apiAuth: ApiAuthService) {
  }

  get isLoggedIn(): Boolean {
    return Boolean(localStorage.getItem("accessToken"))
  }

  login(username: string = 'John Doe', password: string = '123') {
    this.apiAuth.signIn(username, password).subscribe(
      (token) => {
        localStorage.setItem("accessToken", token.access_token)
        console.log(token.access_token)
      }
    )
  }
}
