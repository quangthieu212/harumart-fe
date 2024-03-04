
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailsettingsPage } from './emailsettings.page';

describe('EmailsettingsPage', () => {
  let component: EmailsettingsPage;
  let fixture: ComponentFixture<EmailsettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
