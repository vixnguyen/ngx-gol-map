import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import { ol } from 'ngx-gol-map/ol';
import { createVectorLayer } from 'ngx-gol-map';

const MAPSERVER = `http://kt-mapserver.asiantech.vn/cgi-bin/mapserv/cgi-bin/mapserv`;
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
      url: `${MAPSERVER}?map=/map/simple.json.map&SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&outputformat=geojson&TYPENAME=coastl`
    });
    this.mapOptions = {
      center: [15076237.774, 3970841.618],
      zoom: 12,
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
