import { Injectable } from '@angular/core';
import { AuthService as ApiAuthService } from '../../ApiModule'
import { decodeJwt } from "jose";
import * as models from '../../ApiModule/model/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public apiAuth: ApiAuthService) {
  }

  get isLoggedIn(): Boolean {
    const token = localStorage.getItem("accessToken")
    if (!token) return false
    const claims = decodeJwt(token)
    let exp = new Date(0)
    exp.setUTCSeconds(claims.exp!)
    return new Date() <= exp
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
