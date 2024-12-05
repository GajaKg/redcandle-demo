import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

import { extractChartDataOrdersForMultipleProducts } from '../../../helpers/helpers';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CardComponent } from '../../../components/shared/card/card.component';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';

import Client from '../../../interfaces/client.interface';
import { ClientsStore } from '../../../store/clients/clients.store';
import { ProductsStore } from '../../../store/products/products.store';
import { ChartColumnComponent } from '../../../components/shared/charts/chart-column/chart-column.component';
import { Order } from '../../../interfaces/order.interface';
import { ChipsComponent } from '../../../components/shared/chips/chips.component';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TitleCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    DatePipe,
    ChartColumnComponent,
    MatSnackBarModule,
    ChipsComponent,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private readonly clientStore = inject(ClientsStore);
  private readonly productStore = inject(ProductsStore);
  protected form!: FormGroup;

  protected readonly today = new FormControl(new Date());
  protected selectedId = signal<number>(0);
  protected productQuantity = signal<number>(0);
  protected orderDeliveredOldValue = signal<boolean>(false);
  protected orderEditQuantity = signal<number>(0); // diff between old and new amount
  protected editOrder = signal<any>(undefined);
  protected categoryId = signal<any>(undefined);

  protected selectedOrdersYear: any = signal(new Date().getFullYear());
  protected currentYear: any = signal(new Date().getFullYear());

  protected selectedClient: Signal<Client | undefined> = computed(() =>
    this.clientStore.getSelectedClient()
  );

  public orders = computed(() => this.productStore.ordersBySelectedClient());

  public ordersByYear = computed(() =>
    extractChartDataOrdersForMultipleProducts(this.orders())
  );

  public ordersByMonthCartData = computed(() => {
    console.log(this.ordersByYear());
    const chartData: any = [];
    const productsNames = Object.keys(this.ordersByYear());

    productsNames.forEach((productName: string) => {
      chartData.push({
        name: productName,
        data: this.ordersByYear()[productName][this.selectedOrdersYear()] || [],
      });
    });

    return chartData;
  });

  public ordersByYearCartData = computed(() => {
    console.log(this.ordersByYear());
    const chartData: any = [];
    const productsNames = Object.keys(this.ordersByYear());

    productsNames.forEach((productName: string) => {
      chartData.push({
        name: productName,
        data: this.ordersByYear()[productName][this.selectedOrdersYear()],
      });
    });

    return chartData;
  });

  public orderYears = computed(() => {
    const c: any[] = [];
    const years = new Set<number>();
    const o = Object.values(this.ordersByYear());

    o.forEach((val: any) => {
      c.push(...Object.keys(val));
    });


    c.forEach(val => {
      years.add(+val)
    })

    return Array.from(years).sort().reverse();
  });

  public allProducts = computed(() => this.productStore.products());

  public dataSource = new MatTableDataSource<any>(this.orders());
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected displayedColumns: string[] = [
    'id',
    // 'clientId',
    // 'clientName',
    // 'productId',
    'productName',
    'quantity',
    'date',
    'dateDelivery',
    'paid',
    'delivered',
    'note',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.orders();
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      // this.selectedId = params['id'];
      this.selectedId.set(params['id']);
      this.clientStore.setSelectedClientId(params['id']);
    });

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
      id: this.orders().length + randomIntFromInterval(10, 100),
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

    this._snackBar.open('Uspešno uneta porudžbina!', 'ok', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['success'],
    });

    this.form.reset();
    this.productQuantity.set(0);
  }

  onDeleteOrder(id: number) {
    this.productStore.deleteOrder(id);
  }

  onEditOrder(order: any, i: number) {
    this.orderEditQuantity.set(order.quantity);
    this.orderDeliveredOldValue.set(order.delivered);
    const product = this.productStore.findProductById(order.productId);

    this.editOrder.update((values: any) => {
      return {
        ...order,
        categoryId: product.categoryId,
        date: new FormControl(new Date(order.date)),
        dateDelivery: new FormControl(new Date(order.dateDelivery)),
      };
    });

    this.productQuantity.set(
      product ? +product?.quantity + this.editOrder().quantity : 0
    );
  }

  onEditOrderConfirmed() {
    const copyOrder = {
      id: this.editOrder().id,
      clientId: this.editOrder().clientId,
      clientName: this.editOrder().clientName,
      productId: this.editOrder().productId,
      categoryId: +this.editOrder().categoryId,
      quantity: +this.editOrder().quantity,
      paid: this.editOrder().paid,
      date: this.editOrder().date.value,
      dateDelivery: this.editOrder().dateDelivery.value,
      delivered: this.editOrder().delivered,
      note: this.editOrder().note,
      // ...this.editOrder,
      // date: this.editOrder.date.value,
      // dateDelivery: this.editOrder.dateDelivery.value,
    };

    let orderDiff = this.orderEditQuantity() - +this.editOrder().quantity;

    if (this.editOrder && this.editOrder().quantity <= this.productQuantity()) {
      this.productStore.editOrder(
        copyOrder,
        orderDiff,
        this.orderDeliveredOldValue()
      );
      this.editOrder.set(null);
    } else {
      alert('Nemate dovoljnu količinu u magacinu!');
    }
  }

  onCancel() {
    this.editOrder.set(null);
  }

  orderYearChartHandler(val: any) {
    this.selectedOrdersYear.set(val);
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
