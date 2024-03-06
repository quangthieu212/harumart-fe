import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren, Output, EventEmitter
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-string-field',
  templateUrl: './string-field.component.html',
  styleUrls: ['./string-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StringFieldComponent),
      multi: true
    }
  ]
})
export class StringFieldComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() name: string;
  @Input() inputClass = '';
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() autofocus: boolean;
  @Input() type = 'text';
  @Input() required: boolean;
  @Input() overlay: boolean;
  @Output() focus = new EventEmitter();
  @Output() clickInput = new EventEmitter();
  // @HostBinding('class.float-field-container--is-disabled') isDisabled;
  onTouch: () => void;
  form: FormControl = new FormControl('');
  @ViewChild('input', { static: true }) textInput: IonInput;
  @ViewChildren('fieldContainer') fieldContainers: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private renderer: Renderer2,
  ) {
  }

  ngAfterViewChecked() {
    if (this.autofocus) {
      this.textInput.setFocus();
    }
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.form.statusChanges.subscribe(console.log);
  }

  writeValue(val) {
    this.form.setValue(val);
  }

  registerOnChange(fn) {
    this.form.valueChanges.subscribe(val => {
      fn(val);
    });
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    // this.isDisabled = isDisabled;
    if (this.textInput) {
      // this.renderer.setProperty(this.textInput.nativeElement, 'disabled', this.isDisabled);
    }
  }

  onFocus() {
    this.focus.emit();

  }
  onBlur() {
  }
  onClickInput() {
    this.clickInput.emit();
  }
}
