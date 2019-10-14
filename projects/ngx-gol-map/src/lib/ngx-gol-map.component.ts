import { Inject, Component, Input, Output, OnInit, OnDestroy, AfterViewInit, ElementRef, OnChanges, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaults as defaultControls, FullScreen } from 'ol/control.js';
import { defaults as defaultInteractions, DragPan } from 'ol/interaction.js';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { NgxGolMapService } from './ngx-gol-map.service';

declare let Object;

/**
 * gol map config interface
 */
interface GolMap {
  center: any;
  centerAlt: any;
  address: any;
  zoom: number;
  gmap?: any;
  olmap?: any;
}

interface FsDocument extends HTMLDocument {
  webkitFullscreenElement: Element;
  webkitExitFullscreen: () => void;
  mozFullScreenElement: Element;
  mozCancelFullScreen: () => void;
  msFullscreenElement: Element;
  msCancelFullScreen: () => void;
  onwebkitfullscreenchange: any;
  onmsfullscreenchange: any;
  onmozfullscreenchange: any;
}

const TOKYO_COORDINATE = [15434291.484408574, 4232592.711356004];
const ZOOM = 15;

@Component({
  selector: 'ngx-gol-map',
  template: `
    <div class="map-wrapper">
      <div data-ref="gmap" class="map"></div>
      <div data-ref="olmap" class="map"></div>
      <h6 class="map-copyright">&copy; Asia Air Survey</h6>
    </div>
  `,
  styles: [
    '.map { height: 100%; width: 100%; box-sizing: border-box }'
  ]
})
export class NgxGolMapComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * OPTIONS:
   * gmap: options for google map
   * olmap: options for open layer
   */
  @Input() options: GolMap;
  @Output() onRendered: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  isInitializing: boolean;
  gmap: any;
  olmap: any;
  fsDoc: FsDocument;
  private _google: any;
  private _mapWrraper: any;
  private readonly _options: any;
  isFirstChange: boolean;

  constructor(
    private el: ElementRef,
    private loader: NgxGolMapService,
    @Inject(DOCUMENT) private readonly document: any
  ) {
    // init map options
    this._options = {
      gmap: {},
      olmap: {
        controls: defaultControls({
          zoom: false
        }),
        zoom: 0
      }
    };
    this.fsDoc = document;
  }

  ngOnInit() {
    this.loader.lazyLoadGmapApi().subscribe(_ => {
      this._google = this.document.defaultView.google;
      if (this.isInitializing) {
        this._processMap();
      }
    });
  }

  ngOnDestroy() {
    if (this._mapWrraper) {
      this._mapWrraper.remove();
    }
    if (this.el) {
      this.el.nativeElement.remove();
    }
  }

  ngOnChanges() {
    this._processMap();
  }

  /**
   * renderring the map
   */
  render() {
    this.isFirstChange = true;
    // init gmap
    this.gmap = new this._google.maps.Map(
      this._options.gmap.el,
      this._options.gmap
    );
    // init olmap
    this.olmap = new Map(this._options.olmap);
    // get view
    const view = this.olmap.getView();
    view.on('change:resolution', () => {
      if (this.isFirstChange) {
        this.gmap.setZoom(view.getZoom());
      }
    });
    view.on('change:center', () => {
      this.mappingMapsCenter(view);
    });
    // trigger to change gmap view after changing olmap view
    view.on('change', () => {
      let zoomLevel = view.getZoom();
      if (zoomLevel % 1 !== 0) {
        zoomLevel = this._roundTo(zoomLevel, 0);
        view.setZoom(zoomLevel);
      }
      this.gmap.setZoom(zoomLevel);
      this.mappingMapsCenter(view);
      this.isFirstChange = false;
    });
    if (this._options.olmap.el) {
      // olmap element remove itsefl
      this._mapWrraper.removeChild(this._options.olmap.el);
      // push olmap layers to gmap
      this.gmap.controls[this._google.maps.ControlPosition.TOP_LEFT].push(this._options.olmap.el);
    }
    // trigger zoom changed
    // this.gmap.addListener('zoom_changed', () => {
    //   view.setZoom(this.gmap.getZoom());
    // });
    // this._detectFullScreenCrossBrowser();
    if (!this.options.center && !this.options.centerAlt && this.options.address) {
      this.centeringToAddress();
    }
    view.setZoom(this.options.zoom || ZOOM);
    view.setCenter(this.options.center || this.options.centerAlt || TOKYO_COORDINATE);
    this.onRendered.emit(true);
    // // Disabled use one finger touch to drag map in mobile
    this.olmap.on('click', event => {
      let pointLayer: any;
      const featureAtPixel = this.olmap.forEachFeatureAtPixel(event.pixel, (ft: any, layer: any) => {
        pointLayer = layer;
        return ft;
      });
      const emitData = {
        event,
        map: this.olmap,
        layer: pointLayer,
        featureAtPixel
      };
      this.onClick.emit(emitData);
    });
  }

  mappingMapsCenter(view: any) {
    let center = view.getCenter();
    center = this.transformEpsg(center, 'EPSG:3857', 'EPSG:4326');
    this.gmap.setCenter(new this._google.maps.LatLng(center[1], center[0]));
  }

  /**
   * Centering a map with the address
   */
  centeringToAddress() {
    this.loader.getCoordByAddress(this.options.address).subscribe(coordinate => {
      if (coordinate) {
        this.olmap.getView().setCenter(this.transformEpsg(coordinate));
      }
    });
  }

  /**
   * set options for both google map and openlayer map
   */
  setOptions() {
    const mapTypes: any = ['gmap', 'olmap'];
    mapTypes.forEach((type: string) => {
      this._setOption(type);
    });
  }

  /**
   * set targets as DOM elements
   */
  setTargets() {
    this._mapWrraper = this.el.nativeElement.childNodes[0];
    this._options.gmap.el = this._mapWrraper.childNodes[0];
    this._options.olmap.el = this._mapWrraper.childNodes[1];
    this._options.olmap.target = this._mapWrraper.childNodes[1];
  }

  /**
   * set google map type id
   * @param mapTypeId is a string
   */
  setGmapType(mapTypeId: string) {
    this.gmap.setMapTypeId(this._google.maps.MapTypeId[mapTypeId]);
  }

  /**
   * get map center coordinate
   */
  getMapCenter() {
    return this.olmap.getView().getCenter();
  }

  /**
   * get map's current zoom level
   */
  getZoomLevel() {
    return this.olmap.getView().getZoom();
  }

  /**
   * get openlayer map view
   */
  getMapView() {
    return this.olmap.getView();
  }

  /**
   * Centering the map
   * @param coordinate it's required
   * @param isEPSG4236 default is false
   * - if coordinate is EPSG:4326 it will be transformed to EPSG:3857 then centering the map
   */
  setMapCenter(coordinate: any, isEPSG4236: boolean = false) {
    if (isEPSG4236) {
      coordinate = this.transformEpsg(coordinate);
    }
    this.olmap.getView().setCenter(coordinate);
  }

  private transformEpsg(coordinate: any, src: string = 'EPSG:4326', dest: string = 'EPSG:3857') {
    return transform(coordinate, src, dest);
  }

  /**
   * Listening toggle full screen event
   */
  private _detectFullScreenCrossBrowser() {
    this.fsDoc.onfullscreenchange = () => {
      this._updateSizeOlMap();
    };
    this.fsDoc.onwebkitfullscreenchange = () => {
      this._updateSizeOlMap();
    };
    this.fsDoc.onmsfullscreenchange = () => {
      this._updateSizeOlMap();
    };
    this.fsDoc.onmozfullscreenchange = () => {
      this._updateSizeOlMap();
    };
  }

  /**
   * Update size for openlayer map when toggle full screen
   */
  private _updateSizeOlMap() {
    // Using setTimeout for run after fullscreen finish
    const t = setTimeout(() => {
      this.olmap.updateSize();
      clearTimeout(t);
    });
  }

  private _setOption(type: string) {
    // init default options
    const defaultOptions = {
      gmap: {
        disableDefaultUI: true,
        keyboardShortcuts: false,
        draggable: false,
        disableDoubleClickZoom: true,
        scrollwheel: false,
        streetViewControl: false,
        zoomControl: false,
        fullscreenControl: false,
        center: new this._google.maps.LatLng(0, 0),
        zoom: 0
      },
      olmap: {
        controls: defaultControls().extend({
          zoom: false
        }),
        view: new View({
          center: [0, 0],
          zoom: 0,
          zoomOptions: {
            duration: 0
          },
          maxZoom: 21,
          enableRotation: false
        })
      }
    };
    if (this.options[type]) {
      this._options[type] = Object.assign({}, defaultOptions[type], this.options[type]);
      if (type === 'gmap' && this.options[type].mapTypeId) {
        // set google mapTypeId from input string
        this._options[type].mapTypeId = this._google.maps.MapTypeId[this.options.gmap.mapTypeId];
      }
    } else {
      this._options[type] = defaultOptions[type];
    }
  }

  private _roundTo(n, digits) {
    if (digits === undefined) {
      digits = 0;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    const test = (Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
  }

  private _processMap() {
    if (this.options && this._google) {
      this.setOptions();
      if (!this._options.gmap.target) {
        this.setTargets();
      }
      this.render();
      this.isInitializing = false;
    } else {
      this.isInitializing = true;
    }
  }
}
