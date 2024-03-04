
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordresetPage } from './passwordreset.page';

describe('PasswordresetPage', () => {
  let component: PasswordresetPage;
  let fixture: ComponentFixture<PasswordresetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordresetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
