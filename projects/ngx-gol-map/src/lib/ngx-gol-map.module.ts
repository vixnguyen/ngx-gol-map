import { NgModule, ModuleWithProviders, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { NgxGolMapComponent } from './ngx-gol-map.component';

@NgModule({
  declarations: [NgxGolMapComponent],
  exports: [NgxGolMapComponent]
})

export class NgxGolMapModule {
  static forRoot(config: any): ModuleWithProviders {
    console.log('for root', config);
    return {
      ngModule: NgxGolMapModule,
      // providers: [
      //   { provide: MapsAPILoader, useClass: LazyMapsAPILoader, useFactory: test },
      //   { provide: LAZY_MAPS_API_CONFIG, useValue: config }
      // ]
    };
  }

  static forChild() {
    return {
      ngModule: NgxGolMapModule
    };
  }
}
