import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxGolMapModule } from 'ngx-gol-map';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxGolMapModule.forRoot({
      apiKey: 'AIzaSyBInCkESWtilKBUkRve3TnXsE1cebJg8l4'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
