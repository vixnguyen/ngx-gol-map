import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { createVectorLayer } from 'ng-gol-map';
import { environment } from '../environments/environment';

@Component({
  selector: 'gol-map-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('golmap', {static: true}) golmap;
  mapOptions: any = null;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const vnBoundary = createVectorLayer({
      url: `${environment.mapDataUrl}/vn.geojson`
    });
    this.mapOptions = {
      center: [12047561.375522647, 1813054.1072575005],
      zoom: 5,
      olmap: {
        layers: [
          vnBoundary
        ]
      },
      gmap: {
        // mapTypeId: 'SATELLITE'
      }
    };
  }
}
