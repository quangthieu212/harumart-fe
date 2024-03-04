
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplypromoPage } from './applypromo.page';

describe('ApplypromoPage', () => {
  let component: ApplypromoPage;
  let fixture: ComponentFixture<ApplypromoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplypromoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplypromoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
