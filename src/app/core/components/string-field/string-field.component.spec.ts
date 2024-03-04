import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StringFieldComponent } from './string-field.component';

describe('StringFieldComponent', () => {
  let component: StringFieldComponent;
  let fixture: ComponentFixture<StringFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringFieldComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StringFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
