
import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { ClientsStore } from '@/features/clients/store/clients.store';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import Client from '@/features/clients/types/client.interface';

@Component({
  selector: 'app-client-detail-order-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './client-detail-order-form.component.html',
  styleUrl: './client-detail-order-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailOrderFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly clientStore = inject(ClientsStore);
  private readonly productStore = inject(ProductsStore);
  private readonly snackBar = inject(MatSnackBar);
  protected form!: FormGroup;

  protected selectedId = signal<number>(0);
  protected productQuantity = signal<number>(0);
  protected orderDeliveredOldValue = signal<boolean>(false);
  protected orderEditQuantity = signal<number>(0); // diff between old and new amount
  protected categoryId = signal<number | undefined>(undefined);

  protected selectedClient: Signal<Client | undefined> = computed(() =>
    this.clientStore.getSelectedClient()
  );

  public allProducts = computed(() => this.productStore.products());

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      product: [null, Validators.required],
      // product: [this.orders(), Validators.required],
      quantity: [null, Validators.required],
      paid: [false],
      note: [null],
      date: [null],
      dateDelivery: [null],
      delivered: [false],
      // paid: [false, Validators.required],
      // note: [null],
      // date: [null , Validators.required],
      // dateDelivery: [null, Validators.required],
      // delivered: [false, Validators.required],
    });
  }

  onSelectProduct(productId: number) {
    const product = this.productStore.findProductById(productId);

    this.productQuantity.set(product ? product?.quantity : 0);
    this.form.get('quantity')?.patchValue(product ? product?.quantity : 0);

    this.categoryId.set(product.categoryId);

    // this.editOrder.update((values: any) => {
    //   return {
    //     ...values,
    //     categoryId: product.categoryId
    //   };
    // });
  }

  onSubmit() {
    if (
      this.form.controls['product'].errors ||
      this.form.controls['quantity'].errors ||
      this.form.controls['paid'].errors ||
      this.form.controls['date'].errors ||
      this.form.controls['dateDelivery'].errors ||
      this.form.controls['delivered'].errors
    ) {
      alert('Unesite podatke');
      return;
    }

    const productId = +this.form.controls['product'].value;
    const quantity = +this.form.controls['quantity'].value;
    const paid = this.form.controls['paid'].value;
    const date = this.form.controls['date'].value;
    const dateDelivery = this.form.controls['dateDelivery'].value;
    const delivered = this.form.controls['delivered'].value;
    const note = this.form.controls['note'].value;
    const categoryId = this.categoryId();

    this.productStore.addOrder({
      // id: this.orders().length + randomIntFromInterval(10, 100),
      id: 123,
      clientId: +this.selectedId(),
      productId,
      categoryId,
      quantity,
      date,
      paid,
      dateDelivery,
      delivered,
      note,
    });

    this.snackBar.open('Uspešno uneta porudžbina!', 'ok', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['success'],
    });

    this.form.reset();
    this.productQuantity.set(0);
  }


}
