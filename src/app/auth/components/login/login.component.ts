import { Component } from '@angular/core';
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { take } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = new FormControl('');
  password = new FormControl('');
  wrong: boolean = false

  constructor(public authService: AuthService, protected router: Router) {
  }

  ngAfterViewInit() {
    if (this.authService.isLoggedInAdmin)
      this.router.navigate(['/admin/edit'])
  }

  login() {
    this.authService.login(this.username.value!, this.password.value!)
    this.authService.onLogged.pipe(take(1)).subscribe(() => {
      if (this.authService.isLoggedInAdmin)
        window.open('/admin/edit', '_self')
      else if (this.authService.isLoggedInOperator)
        window.open('/schedule', '_self')
      else
        this.wrong = true
    })
  }

  get access_token() {
    return localStorage.getItem("accessToken")
  }
}
