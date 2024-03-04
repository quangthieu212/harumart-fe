
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WishcashPage } from './wishcash.page';

describe('WishcashPage', () => {
  let component: WishcashPage;
  let fixture: ComponentFixture<WishcashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishcashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishcashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
