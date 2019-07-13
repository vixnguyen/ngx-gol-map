import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxGolMapComponent } from './ngx-gol-map.component';

@NgModule({
  declarations: [NgxGolMapComponent],
  exports: [NgxGolMapComponent],
  imports: [
  ]
})
export class NgxGolMapModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: NgxGolMapModule,
      providers: [{ provide: config, useValue: config }]
    };
  }

  static forChild() {
    return {
      ngModule: NgxGolMapModule
    };
  }
}
