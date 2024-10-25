import {
  Component,
  computed,
  inject,
  ViewChild,
  effect,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  @Output() public submitEmit = new EventEmitter<{
    name: string;
    amount: number;
  }>();

  ngOnInit() {
    this.initForm();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (
      this.form.controls['name'].errors ||
      this.form.controls['amount'].errors
    ) {
      alert('Unesite podatke');
      return;
    }

    const name = this.form.controls['name'].value;
    const amount = this.form.controls['amount'].value;

    this.submitEmit.emit({ name, amount });
    this.form.reset();
  }

}
