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

@Component({
  selector: 'app-textarea-field',
  templateUrl: './text-area-field.component.html',
  styleUrls: ['./text-area-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFieldComponent),
      multi: true
    }
  ]
})
export class TextareaFieldComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() name: string;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() type = 'text';
  @Input() required: boolean;
  @Output() focus = new EventEmitter();
  @HostBinding('class.float-field-container--is-disabled') isDisabled;
  onTouch: () => void;
  form: FormControl = new FormControl('');
  @ViewChild('input', { static: true }) textInput: ElementRef;
  @ViewChildren('fieldContainer') fieldContainers: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private renderer: Renderer2,
  ) {
  }

  ngAfterViewInit() {
    // this.fieldContainers.forEach(container => {
    //   const that = this;
    //   // tslint:disable-next-line:only-arrow-functions
    //   container.nativeElement.addEventListener('click', function (event) {
    //     event.stopPropagation();
    //     const inputElement = this.querySelector('input');
    //     if (inputElement) {
    //       // that.onTouch();
    //       inputElement.focus();
    //     }
    //   }, true);
    // });

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
    this.isDisabled = isDisabled;
    if (this.textInput) {
      // this.renderer.setProperty(this.textInput.nativeElement, 'disabled', this.isDisabled);
    }
  }

  onFocus() {
    this.focus.emit();

  }
  onBlur() {
  }
}
