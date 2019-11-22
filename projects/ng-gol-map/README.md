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

## Built-in

### GolMap (component)
- setGmapType, setCenter, setZoom
- getView, getCenter, getZoom
- onRendered, onClick

### Service
- findCurrentLocation, getCoordByAddress, getDefaultZoom, getDefaultCnter

### Utilities
- createVectorLayer, createTileLayer, createRasterLayer
