# NgGolMap

## Install
Run `npm i ng-gol-map`

## Usage

Import NgGolMap to your AppModule
```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGolMapModule.forRoot({
      apiKey: 'Your Google Maps API key'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

Define options for your map
```
this.mapOptions = {
  center: '',
  zoom: '',
  olmap: {
    ...
  },
  gmap: {
    ...
  }
}
```

Your template look like
```
<ng-gol-map [options]="mapOptions"></ng-gol-map>
```
