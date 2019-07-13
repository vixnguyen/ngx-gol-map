import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare const google;
@Component({
  selector: 'gol-map-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  // @ViewChild('gmap', {static: true}) gmap;
  mapOptions: any = null;

  constructor() {
    console.log('app construtor');
    //
  }

  ngOnInit() {
    console.log('app init');
    //
  }

  ngAfterViewInit() {
    console.log('app view init', google);
    this.mapOptions = {
      center: [15076237.774, 3970841.618],
      zoom: 12,
      olmap: {
        layers: [
          // this.olLayer['ocean'],
          // this.olLayer['coast']
        ]
      },
      gmap: {
        mapTypeId: 'SATELLITE'
      }
    };
  }
}
