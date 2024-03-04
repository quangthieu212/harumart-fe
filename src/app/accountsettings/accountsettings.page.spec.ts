
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsettingsPage } from './accountsettings.page';

describe('AccountsettingsPage', () => {
  let component: AccountsettingsPage;
  let fixture: ComponentFixture<AccountsettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
