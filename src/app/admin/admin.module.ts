import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule, Configuration } from "../../ApiModule";
import { AuthModule } from "../auth/auth.module";
import { InstructorComponent } from './components/instructor/instructor.component';


@NgModule({
  declarations: [
    InstructorComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    ApiModule
  ],
  providers: [
    {
      provide: Configuration,
      useFactory: () => new Configuration(
        {
          credentials: { OAuth2PasswordBearer : <string>localStorage.getItem("accessToken")},
        }
      ),
    },
  ]
})
export class AdminModule { }
