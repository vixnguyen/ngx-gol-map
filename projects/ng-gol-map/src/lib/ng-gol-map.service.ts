import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, ReplaySubject, Observable, forkJoin } from 'rxjs';
import Geolocation from 'ol/Geolocation';
declare const google;
export interface GolMapModuleConfig {
  apiKey: string;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}
export const GOLMAP_MODULE_CONFIG = new InjectionToken<GolMapModuleConfig>('Gol map Configuration');

@Injectable({
  providedIn: 'root'
})
export class NgGolMapService {

  private loadedLibraries: { [url: string]: ReplaySubject<any> } = {};
  private moduleConfig: GolMapModuleConfig;
  private locationObserver$: Subject<any>;

  constructor(
    @Inject(GOLMAP_MODULE_CONFIG) private readonly config: GolMapModuleConfig,
    @Inject(DOCUMENT) private readonly document: any
  ) {
    this.moduleConfig = config;
    this.locationObserver$ = new Subject();
  }

  lazyLoadGmapApi(): Observable<any> {
    return forkJoin([
      this.loadScript(`https://maps.googleapis.com/maps/api/js?key=${this.moduleConfig.apiKey}`)
    ]);
  }

  getDefaultZoom() {
    return this.moduleConfig.defaultZoom || 5;
  }

  getDefaultCenter() {
    return this.moduleConfig.defaultCenter || [0, 0];
  }

  findCurrentLocation() {
    // Init geolocation
    const geolocation = new Geolocation({
      projection: 'EPSG:3857',
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 2000
      }
    });
    // Handle geolocation error
    geolocation.on('error', (error: any) => {
      this.locationObserver$.error(error);
    });

    // Request to get current position
    geolocation.on('change:position', () => {
      const position = geolocation.getPosition();
      this.locationObserver$.next(position);
      // trick to renew geolocation tracking
      geolocation.setTracking(false);
    });
  }

  /**
   * Reverse geocoding by location address.
   *
   * Wraps the Google Maps API geocoding service into an observable.
   *
   * @param address Location adress
   * @return An observable of GeocoderResult
   */
  getCoordByAddress(address): Observable<any> {
    const geocoder = new google.maps.Geocoder();
    return new Observable((observer) => {
      geocoder.geocode({
        address
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const coord = [results[0].geometry.location.lng(), results[0].geometry.location.lat()];
          observer.next(coord);
          observer.complete();
        } else {
          observer.error(status);
          observer.complete();
        }
      });
    });
  }

  private loadScript(url: string): Observable<any> {
    if (this.loadedLibraries[url]) {
      // do nothing
    } else {
      this.loadedLibraries[url] = new ReplaySubject();

      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = url;
      script.onload = () => {
        this.loadedLibraries[url].next();
        this.loadedLibraries[url].complete();
      };

      this.document.body.appendChild(script);
    }

    return this.loadedLibraries[url].asObservable();
  }
}
