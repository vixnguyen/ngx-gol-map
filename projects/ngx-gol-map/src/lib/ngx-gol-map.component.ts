import { Inject, Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaults as defaultControls, FullScreen } from 'ol/control.js';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { NgxGolMapService } from './ngx-gol-map.service';

declare let Object;
const DEFAULT_OPTIONS = {
   gmap: {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    draggable: false,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    streetViewControl: false,
    // center: new this._google.maps.LatLng(0, 0),
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
  isInitializing: boolean;
  gmap: any;
  olmap: any;
  private _google: any;
  private readonly _options: any;

  constructor(
    private el: ElementRef,
    private loader: NgxGolMapService,
    @Inject(DOCUMENT) private readonly document: any
  ) {
    // init map options
    this._options = {
      gmap: {},
      olmap: {}
    };
  }

  ngOnInit() {
    this.loader.lazyLoadGmapApi().subscribe(_ => {
      this._google = this.document.defaultView.google;
      if (this.isInitializing) {
        this._processMap();
      }
    });
    //
  }

  ngAfterViewInit() {
    this._processMap();
  }

  ngOnDestroy() {
    //
  }

  ngOnChanges() {
    this._processMap();
  }

  /**
   * renderring the map
   */
  render() {
    // init gmap
    this.gmap = new this._google.maps.Map(
      this._options.gmap.el,
      this._options.gmap
    );
    // init olmap
    this.olmap = new Map(this._options.olmap);
    // get view
    const view = this.olmap.getView();
    // trigger to change gmap view after changing olmap view
    view.on('change:center', () => {
      const center = transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
      this.gmap.setCenter(new this._google.maps.LatLng(center[1], center[0]));
    });
    view.on('change:resolution', () => {
      this.gmap.setZoom(view.getZoom());
    });
    // setting the view by options
    view.setZoom(this.options.zoom);
    view.setCenter(this.options.center);
    // olmap element remove itsefl
    this.el.nativeElement.removeChild(this._options.olmap.el);
    // push olmap layers to gmap
    this.gmap.controls[this._google.maps.ControlPosition.TOP_LEFT].push(this._options.olmap.el);
  }

  /**
   * set options for both google map and openlayer map
   */
  setOptions() {
    const mapTypes: any = ['gmap', 'olmap'];
    mapTypes.forEach((type: string) => {
      this._setOption(type);
    });
    this._options.gmap.center = new this._google.maps.LatLng(0, 0);
  }

  /**
   * set targets as DOM elements
   */
  setTargets() {
    this._options.gmap.el = this.el.nativeElement.childNodes[0];
    this._options.olmap.el = this.el.nativeElement.childNodes[1];
    this._options.olmap.target = this.el.nativeElement.childNodes[1];
  }

  /**
   * set google map type id
   * @param mapTypeId is a string
   */
  setGmapType(mapTypeId: string) {
    this.gmap.setMapTypeId(this._google.maps.MapTypeId[mapTypeId]);
  }

  private _setOption(type: string) {
    if (this.options[type]) {
      this._options[type] = Object.assign(this._options[type], DEFAULT_OPTIONS[type], this.options[type]);
    }
    if (type === 'gmap' && this.options[type].mapTypeId) {
      // set google mapTypeId from input string
      this._options[type].mapTypeId = this._google.maps.MapTypeId[this.options.gmap.mapTypeId];
    }
  }

  private _processMap() {
    if (this.options && this._google) {
      if (!this._options.gmap.target) {
        this.setTargets();
      }
      this.setOptions();
      this.render();
      this.isInitializing = false;
    } else {
      this.isInitializing = true;
    }
  }

}
