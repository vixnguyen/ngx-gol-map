import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgGolMapModule } from 'ng-gol-map';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGolMapModule.forRoot({
      apiKey: 'AIzaSyBInCkESWtilKBUkRve3TnXsE1cebJg8l4'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
