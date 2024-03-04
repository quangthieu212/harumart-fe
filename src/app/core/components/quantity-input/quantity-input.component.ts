import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => QuantityInputComponent), multi: true }
  ]
})
export class QuantityInputComponent implements OnInit, ControlValueAccessor {

  @Input() max = 100;
  @Input() disabled;
  @Output() outputQty = new EventEmitter<number>();
  form: FormGroup;

  constructor(
    private  fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      quantity: new FormControl(1)
    });
  }

  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any) {
  }

  writeValue(obj: any) {
    this.form.setValue(obj);
  }

  onClickAdd() {
    if (+this.form.value.quantity <= this.max) {
      const newQuantity = +this.form.value.quantity + 1;
      this.form.controls.quantity.setValue(newQuantity);
      this.outputQty.emit(newQuantity);
    }
  }

  onClickRemove() {
    const newQuantity = +this.form.value.quantity <= 1 ? 1 : +this.form.value.quantity - 1;
    this.form.controls.quantity.setValue(newQuantity);
    this.outputQty.emit(newQuantity);
  }

}
