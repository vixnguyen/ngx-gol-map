import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgGolMapModule } from 'ng-gol-map';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGolMapModule.forRoot({
      apiKey: environment.apiKey,
      defaultZoom: 7,
      defaultCenter: [11782284.054689, 2394570.086694302] // Location of Hanoi - Vietnam
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
