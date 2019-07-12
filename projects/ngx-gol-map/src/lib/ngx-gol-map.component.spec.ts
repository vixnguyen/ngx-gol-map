import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGolMapComponent } from './ngx-gol-map.component';

describe('NgxGolMapComponent', () => {
  let component: NgxGolMapComponent;
  let fixture: ComponentFixture<NgxGolMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGolMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGolMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
