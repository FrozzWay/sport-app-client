import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

import { InstructorComponent } from "./admin/components/instructor/instructor.component"
import { WidgetComponent } from "./public/schedule/components/widget/widget.component";
import { LoginComponent } from "./auth/components/login/login.component";

import { authGuard } from "./auth/auth.guard";


const routes: Routes = [
  {
    path: 'admin',
    canActivateChild: [authGuard],
    children: [
      { path: 'instructors', component: InstructorComponent }
    ]
  },
  { path: 'schedule', component: WidgetComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
