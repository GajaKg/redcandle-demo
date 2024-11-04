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

import { Product, Production } from '../../../interfaces/product.interface';
import { CardComponent } from '../../../components/shared/card/card.component';
import { ProductsStore } from '../../../store/products/products.store';
import { ChartPieComponent } from '../../../components/shared/charts/chart-pie/chart-pie.component';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';
import { ChartColumnComponent } from '../../../components/shared/charts/chart-column/chart-column.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsStore = inject(ProductsStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly today = new FormControl(new Date());
  protected form!: FormGroup;
  protected productId?: number;
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

  productionYearChart(year: any) {
    this.selectedProductionYear.set(year);
    this.updatedCharts();
  }

  initForm() {
    this.form = this.formBuilder.group({ date: [this.today], quantity: [0] });
  }

  onSubmit() {
    if (
      this.form.controls['quantity'].errors ||
      this.form.controls['date'].errors ||
      !this.productId
    ) {
      alert('Unesite podatke');
      return;
    }

    const quantity: number = +this.form.controls['quantity'].value;
    const date: string | Date = this.form.controls['date'].value;
    const production: Production = { date: date, quantity: quantity };
    this.productsStore.addProduction(this.productId, production);

    this.updatedCharts();
  }

  onCancel() {
    this.editElementIndex.set(undefined);
    this.editElement.set(undefined);
  }

  onEditProductionConfirmed() {
    if (!this.selectedProduct()) {
      this.onCancel();
      return;
    }

    const copy = structuredClone(this.selectedProduct()!.production);
    const production: Production[] = copy.map(
      (element: Production, index: number): Production => {
        return index == this.editElementIndex()
          ? { ...this.editElement() }
          : element;
      }
    );

    const product: any = {
      // const product: Product = {
      ...this.selectedProduct(),
      production: [...production],
    };

    this.productsStore.editProduct(product);

    this.updatedCharts();

    this.onCancel();
  }

  onEditProduction(index: number, element: Production) {
    this.editElementIndex.set(index);
    this.editElement.update((values: any) => {
      return {...element};
    });
  }

  protected onDeleteProduction(index: number) {
    if (!this.selectedProduct()) {
      this.onCancel();
      return;
    }

    const copy = structuredClone(this.selectedProduct()!.production);
    copy.splice(index, 1);

    const product: any = {
      // const product: Product = {
      ...this.selectedProduct(),
      production: [...copy],
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
        data[month] = prod.quantity;
      }
    });

    this.chartDataProduction.update((values: any) => {
      return [{ name: 'Količina', data }];
    });

    this.chartData.update((values: any) => {
      return [
        this.selectedProduct()!.amount || 0,
        this.selectedProduct()!.stockCapacity -
          this.selectedProduct()!.amount || 0,
      ];
    });
  }
}
