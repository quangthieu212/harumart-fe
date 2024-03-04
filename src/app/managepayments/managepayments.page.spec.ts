
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagepaymentsPage } from './managepayments.page';

describe('ManagepaymentsPage', () => {
  let component: ManagepaymentsPage;
  let fixture: ComponentFixture<ManagepaymentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagepaymentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
