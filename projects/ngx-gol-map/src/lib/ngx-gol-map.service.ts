import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ReplaySubject, Observable, forkJoin } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export interface GolMapModuleConfig {
  apiKey: string;
}
export const GOLMAP_MODULE_CONFIG = new InjectionToken<GolMapModuleConfig>('Gol map Configuration');

@Injectable()
export class NgxGolMapService {

  private loadedLibraries: { [url: string]: ReplaySubject<any> } = {};
  private moduleConfig: GolMapModuleConfig;

  constructor(
    @Inject(GOLMAP_MODULE_CONFIG) private readonly config: GolMapModuleConfig,
    @Inject(DOCUMENT) private readonly document: any
  ) {
    this.moduleConfig = config;
  }

  lazyLoadGmapApi(): Observable<any> {
    return forkJoin([
      this.loadScript(`https://maps.googleapis.com/maps/api/js?key=${this.moduleConfig.apiKey}`)
    ]);
  }

  private loadScript(url: string): Observable<any> {
    if (this.loadedLibraries[url]) {
      return this.loadedLibraries[url].asObservable();
    }

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
    return this.loadedLibraries[url].asObservable();
  }
}
