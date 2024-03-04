
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationssettingsPage } from './notificationssettings.page';

describe('NotificationssettingsPage', () => {
  let component: NotificationssettingsPage;
  let fixture: ComponentFixture<NotificationssettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationssettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationssettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
