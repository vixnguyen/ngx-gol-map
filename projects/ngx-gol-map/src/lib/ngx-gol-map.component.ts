import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, OnChanges } from '@angular/core';
import { defaults as defaultControls, FullScreen } from 'ol/control.js';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import View from 'ol/View';

declare let google;
const DEFAULT_OPTIONS = {
   gmap: {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false,
    // center: new google.maps.LatLng(0, 0),
    zoom: 0
  },
  olmap: {
    controls: defaultControls().extend([
      new FullScreen()
    ]),
    view: new View({
      center: [0, 0],
      zoom: 0,
      maxZoom: 21
    })
  }
};

/**
 * gol map config interface
 */
interface GolMap {
  center: any;
  zoom: number;
  gmap?: any;
  olmap?: any;
}

@Component({
  selector: 'ngx-gol-map',
  template: `
    <div data-ref="gmap" class="map"></div>
    <div data-ref="olmap" class="map"></div>
  `,
  styles: [
    '.map { height: 100vh; width: 100% }'
  ]
})
export class NgxGolMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  /**
   * OPTIONS:
   * gmap: options for google map
   * olmap: options for open layer
   */
  @Input() options: GolMap;
  gmap: any;
  olmap: any;
  private _options: any;

  constructor(
    private el: ElementRef
  ) {
    console.log('gol construtor');
    // init map options
    this._options = {
      gmap: {},
      olmap: {}
    };
  }

  ngOnInit() {
    console.log('gol init');
    //
  }

  ngAfterViewInit() {
    console.log('gol view init');
    // if (this.options) {
    //   this.setTargets();
    //   this.setOptions();
    //   this.render();
    // }
  }

  ngOnDestroy() {
    //
  }

  ngOnChanges() {
    console.log('gol view change');
    // if (this.options && google) {
    //   this.setTargets();
    //   this.setOptions();
    //   this.render();
    // }
  }

  /**
   * renderring the map
   */
  render() {
    // init gmap
    this.gmap = new google.maps.Map(
      this._options['gmap']['el'],
      this._options['gmap']
    );
    // init olmap
    this.olmap = new Map(this._options['olmap']);
    // get view
    const view = this.olmap.getView();
    // trigger to change gmap view after changing olmap view
    view.on('change:center', () => {
      const center = transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
      this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
    });
    view.on('change:resolution', () => {
      this.gmap.setZoom(view.getZoom());
    });
    // setting the view by options
    view.setZoom(this.options.zoom);
    view.setCenter(this.options.center);
    // olmap element remove itsefl
    this.el.nativeElement.removeChild(this._options['olmap']['el']);
    // push olmap layers to gmap
    this.gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(this._options['olmap']['el']);
  }

  /**
   * set options for both google map and openlayer map
   */
  setOptions() {
    ['gmap', 'olmap'].forEach((type: string) => {
      this._setOption(type);
    });
    this._options['gmap']['center'] = new google.maps.LatLng(0, 0);
  }

  /**
   * set targets as DOM elements
   */
  setTargets() {
    this._options['gmap']['el'] = this.el.nativeElement.childNodes[0];
    this._options['olmap']['el'] = this.el.nativeElement.childNodes[1];
    this._options['olmap'].target = this.el.nativeElement.childNodes[1];
  }

  /**
   * set google map type id
   * @param mapTypeId is a string
   */
  setGmapType(mapTypeId: string) {
    this.gmap.setMapTypeId(google.maps.MapTypeId[mapTypeId]);
  }

  private _setOption(type: string) {
    if (this.options[type]) {
      this._options[type] = Object.assign(this._options[type], DEFAULT_OPTIONS[type], this.options[type]);
    }
    if (type === 'gmap' && this.options[type].mapTypeId) {
      // set google mapTypeId from input string
      this._options[type].mapTypeId = google.maps.MapTypeId[this.options.gmap.mapTypeId];
    }
  }

}
