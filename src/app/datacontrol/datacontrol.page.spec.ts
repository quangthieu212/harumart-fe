
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatacontrolPage } from './datacontrol.page';

describe('DatacontrolPage', () => {
  let component: DatacontrolPage;
  let fixture: ComponentFixture<DatacontrolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatacontrolPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacontrolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
