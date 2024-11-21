import {
  Component,
  inject,
  EventEmitter,
  Output,
  computed,
} from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsStore } from '../../../store/products/products.store';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private readonly _productStore = inject(ProductsStore);
  private readonly formBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  @Output() public submitEmit = new EventEmitter<{
    categoryId: number;
    name: string;
    quantity: number;
    stockCapacity: number;
  }>();

  protected categories = computed(() => this._productStore.categories())

  ngOnInit() {
    this.initForm();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  initForm() {
    this.form = this.formBuilder.group({
      category: ['', [Validators.required]],
      name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (
      this.form.controls['category'].errors ||
      this.form.controls['name'].errors ||
      this.form.controls['capacity'].errors ||
      this.form.controls['quantity'].errors
    ) {
      alert('Unesite podatke');
      return;
    }

    const categoryId = this.form.controls['category'].value;
    const name = this.form.controls['name'].value;
    const quantity = this.form.controls['quantity'].value;
    const stockCapacity = this.form.controls['capacity'].value;

    this.submitEmit.emit({ categoryId, name, quantity, stockCapacity });
    this.form.reset();
  }

}
