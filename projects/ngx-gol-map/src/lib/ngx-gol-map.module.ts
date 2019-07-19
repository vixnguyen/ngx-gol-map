import { NgModule, ModuleWithProviders, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { NgxGolMapComponent } from './ngx-gol-map.component';
import { NgxGolMapService, GOLMAP_MODULE_CONFIG } from './ngx-gol-map.service';

@NgModule({
  declarations: [NgxGolMapComponent],
  exports: [NgxGolMapComponent]
})

export class NgxGolMapModule {
  static forRoot(config: any): ModuleWithProviders {
    console.log('for root', config);
    return {
      ngModule: NgxGolMapModule,
      providers: [
        NgxGolMapService,
        {
          provide: GOLMAP_MODULE_CONFIG,
          useValue: config
        }
      ]
    };
  }

  static forChild() {
    return {
      ngModule: NgxGolMapModule
    };
  }
}
