import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { createVectorLayer } from 'ng-gol-map';

const MAPSERVER = `http://localhost:8888/assets/map/vi.geojson`;

@Component({
  selector: 'gol-map-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('gmap', {static: true}) gmap;
  mapOptions: any = null;

  constructor() {
    // console.log(createVectorLayer());
    //
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    const coast = createVectorLayer({
      url: `${MAPSERVER}`
    });
    this.mapOptions = {
      center: [12047561.375522647, 1813054.1072575005],
      zoom: 5,
      olmap: {
        layers: [
          coast
        ]
      },
      gmap: {
        // mapTypeId: 'SATELLITE'
      }
    };
  }
}
