import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';

import { ProductsStore } from '../../../store/products/products.store';
import { Product } from '../../../interfaces/product.interface';
import { TitleCardComponent } from '../../shared/title-card/title-card.component';
import { ChartColumnComponent } from '../../shared/charts/chart-column/chart-column.component';
import { ChipsComponent } from '../../shared/chips/chips.component';

@Component({
  selector: 'app-category-detail-production',
  standalone: true,
  imports: [
    TitleCardComponent,
    ChartColumnComponent,
    MatChipsModule,
    ChipsComponent,
  ],
  templateUrl: './category-detail-production.component.html',
  styleUrl: './category-detail-production.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailProductionComponent {
  private readonly _productStore = inject(ProductsStore);
  public categoryId = input<number>(0);
  protected selectedProductionYear: any = signal(new Date().getFullYear());
  // protected currentYear: any = signal(new Date().getFullYear());

  protected readonly productsByCategory: Signal<Product[]> = computed(() =>
    this._productStore.findProductsByCategoryId(this.categoryId())
  );

  private readonly productionByMonth = computed(() => {
    const o: any = {};
    this.productsByCategory().forEach((product: Product) => {
      const production = product.production;
      production.forEach((prod: any) => {
        // console.log(production)

        const date = new Date(prod.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        // const month = date.toLocaleString('default', { month: 'short' });

        if (o.hasOwnProperty(year)) {
          if (o[year].hasOwnProperty(month)) {
            o[year][month] += prod.quantity;
          } else {
            o[year][month] = prod.quantity;
          }
        } else {
          o[year] = new Array(12).fill(0);
          o[year][month] = prod.quantity;
        }
      });
    });

    return o;
  });

  protected readonly productionYears = computed<string[] | number[]>(() =>
    Object.keys(this.productionByMonth()).slice().reverse()
  );

  protected productionByMonthChartData = computed(() => [
    {
      name: 'Mesečni nivo',
      data: this.productionByMonth()[this.selectedProductionYear()],
    },
  ]);

  protected changeProductionYearsHandler(value: any): void {
    this.selectedProductionYear.set(value);
  }

  protected productionByYearChartData = computed(() => {
    const n: Dic = {};

    this.productionYears().forEach((key: any) => {
      n[key] = this.productionByMonth()[key].reduce(
        (accumulator: number, currentValue: number) =>
          +accumulator + +currentValue,
        0
      );
    });

    return [
      {
        name: 'Godišnji nivo',
        data: Object.values(n),
      },
    ];
  });

  protected productionByYearChartOpt = computed(() => {
    return {
      xaxis: {
        categories: [...this.productionYears().slice().reverse()],
      },
    };
  });
}
interface Dic {
  [key: string]: Object[]
}