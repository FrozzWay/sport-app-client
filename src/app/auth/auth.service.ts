import { EventEmitter, Injectable, Output } from '@angular/core';
import { AuthService as ApiAuthService } from '../../ApiModule'
import { decodeJwt } from "jose";
import * as models from '../../ApiModule/model/models';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() onLogged = new EventEmitter();
  constructor(public apiAuth: ApiAuthService, protected router: Router) {
  }

  get isLoggedInOperator(): Boolean {
    return this.isLoggedIn()
  }

  isLoggedIn(): Boolean {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) return false
      const claims = decodeJwt(token)
      let exp = new Date(0)
      exp.setUTCSeconds(claims.exp!)
      return new Date() <= exp
    } catch (e) {
      return false
    }
  }

  get isLoggedInAdmin(): Boolean {
    if (!this.isLoggedIn())
      return false
    const token = localStorage.getItem("accessToken")
    const claims = decodeJwt(token!)
    // @ts-ignore
    return claims['user']['role'] == 'staff_role.admin'
  }

  login(username: string, password: string) {
    this.apiAuth.signIn(username, password).subscribe({
      next: (token) => {
        localStorage.setItem("accessToken", token.access_token)
        this.onLogged.emit()
        console.log(token.access_token)
      },
      error: () => this.onLogged.emit()
    })
  }

  logOut() {
    localStorage.setItem('accessToken', '')
    window.open('/login', '_self')
  }
}
