import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product, Production } from '../../../interfaces/product.interface';
import { CardComponent } from '../../../components/shared/card/card.component';
import { ProductsStore } from '../../../store/products/products.store';
import { ChartPieComponent } from '../../../components/shared/charts/chart-pie/chart-pie.component';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';
import { ChartColumnComponent } from '../../../components/shared/charts/chart-column/chart-column.component';
import { ProductOrdersComponent } from './product-orders/product-orders.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ProductOrdersComponent,
    ChartColumnComponent,
    CardComponent,
    ChartPieComponent,
    TitleCardComponent,
    CardComponent,
    MatFormFieldModule,
    MatInputModule,
    TitleCardComponent,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DatePipe,
    MatChipsModule,
    MatSnackBarModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsStore = inject(ProductsStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  protected readonly today = new FormControl(new Date());
  protected form!: FormGroup;
  protected productId?: number;
  protected chartPieOpt: any = signal([]);
  protected chartData: any = signal([]);
  protected chartDataProduction: any = signal([]);
  protected currentYear: any = signal(new Date().getFullYear());
  protected selectedProductionYear: any = signal(new Date().getFullYear());
  protected editElement = signal<Production | undefined>(undefined);
  protected editElementIndex = signal<number | undefined>(undefined);

  // table
  protected displayedColumns: string[] = ['id', 'date', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly selectedProduct = computed(() => {
    return this.productsStore.selectedProduct();
  });

  protected readonly productionYears = computed(() => {
    if (!this.productsStore.selectedProduct()) return [];
    const copy = structuredClone(
      this.productsStore.selectedProduct()!.production
    );
    const years = new Set();

    for (let production of copy) {
      if (!production.date) break;
      const moonLanding = new Date(production.date);
      const year = moonLanding.getFullYear();
      years.add(year);
    }
    return Array.from(years).sort().reverse();
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.selectedProduct()?.production || [];
    });
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
      this.productsStore.setSelectedProductId(params['id']);

      this.productsStore.getProductsOrders().subscribe(() => {
        this.updatedCharts();
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  protected productionYearChart(year: any) {
    this.selectedProductionYear.set(year);
    this.updatedCharts();
  }

  private initForm() {
    this.form = this.formBuilder.group({ date: [this.today], quantity: [0] });
  }

  protected onSubmit() {
    if (
      this.form.controls['quantity'].errors ||
      this.form.controls['date'].errors ||
      !this.productId
    ) {
      this._snackBar.open('Unesite podatke', 'ok', {
        duration: 5000,
        verticalPosition: 'top',
      });
      return;
    }
    const copyProduct = structuredClone(this.selectedProduct()!);
    const quantity: number = +this.form.controls['quantity'].value;
    const date: string | Date = this.form.controls['date'].value;
    const production: Production = { date: date, quantity: quantity };

    copyProduct.quantity += quantity;

    const productPayload: Product = {
      ...copyProduct,
      production: [...copyProduct.production, production],
    };
    this.productsStore.editProduct(productPayload);
    // this.productsStore.addProduction(this.productId, production);

    this.updatedCharts();
  }

  protected onCancel() {
    this.editElementIndex.set(undefined);
    this.editElement.set(undefined);
  }

  protected onEditProductionConfirmed() {
    if (!this.selectedProduct()) {
      this.onCancel();
      return;
    }

    const copyProduct = structuredClone(this.selectedProduct()!);
    const productionToEdit = copyProduct.production[this.editElementIndex()!];

    // Calculate Product quantity before change production quantity (code below)
    // const calculateProductQuantity = copyProduct.quantity + (this.editElement()!.quantity! - productionToEdit.quantity!);
    // copyProduct.quantity = calculateProductQuantity;
    copyProduct.quantity +=
      this.editElement()!.quantity! - productionToEdit.quantity!;

    // Edit production
    copyProduct.production[this.editElementIndex()!] = {
      ...this.editElement(),
    };

    const product: any = {
      // const product: Product = {
      ...copyProduct,
      production: [...copyProduct.production],
    };

    this.productsStore.editProduct(product);

    this.updatedCharts();

    this.onCancel();
  }

  protected onEditProduction(index: number, element: Production) {
    this.editElementIndex.set(index);
    this.editElement.update((values: any) => {
      return { ...element };
    });
  }

  protected onDeleteProduction(index: number) {
    if (!this.selectedProduct()) {
      this.onCancel();
      return;
    }

    const copyProduct = structuredClone(this.selectedProduct()!);
    copyProduct.quantity -= copyProduct.production[index].quantity! || 0;
    copyProduct.production.splice(index, 1);

    const product: any = {
      // const product: Product = {
      ...copyProduct,
      production: [...copyProduct.production],
    };

    this.productsStore.editProduct(product);

    this.updatedCharts();
  }

  private updatedCharts(): void {
    // updates column chart
    this.dataSource.data = this.selectedProduct()?.production || [];
    let data = new Array(12).fill(0);
    this.dataSource.data.forEach((prod) => {
      const moonLanding = new Date(prod.date);

      if (this.selectedProductionYear() === moonLanding.getFullYear()) {
        const month = moonLanding.getMonth();
        data[month] += prod.quantity;
      }
    });

    this.chartDataProduction.update((values: any) => {
      return [{ name: 'Količina', data }];
    });

    this.chartData.update((values: any) => {
      return [
        this.selectedProduct()!.quantity || 0,
        this.selectedProduct()!.reserved || 0,
        this.selectedProduct()!.stockCapacity -
          this.selectedProduct()!.quantity || 0,
      ];
    });
  }
}
