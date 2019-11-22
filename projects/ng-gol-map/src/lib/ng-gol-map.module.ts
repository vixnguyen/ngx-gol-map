import { NgModule, ModuleWithProviders, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { NgGolMapComponent } from './ng-gol-map.component';
import { NgGolMapService, GOLMAP_MODULE_CONFIG } from './ng-gol-map.service';

@NgModule({
  declarations: [
    NgGolMapComponent
  ],
  exports: [
    NgGolMapComponent
  ]
})
export class NgGolMapModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: NgGolMapModule,
      providers: [
        NgGolMapService,
        {
          provide: GOLMAP_MODULE_CONFIG,
          useValue: config
        }
      ]
    };
  }

  static forChild() {
    return {
      ngModule: NgGolMapModule
    };
  }
}
