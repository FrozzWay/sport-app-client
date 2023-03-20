import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BASE_PATH } from "../ApiModule";
import { AdminModule } from "./admin/admin.module";
import { PublicModule } from "./public/public.module";
import '@angular/common/locales/global/ru';
import { MaterialModule } from "./material.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    PublicModule,
    AdminModule,
    MaterialModule
  ],
  providers: [
    { provide: BASE_PATH, useValue: 'http://127.0.0.1:8000' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
