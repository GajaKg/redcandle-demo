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

import { TitleCardComponent } from '../../shared/title-card/title-card.component';
import { Order } from '../../../interfaces/order.interface';
import { ProductsStore } from '../../../store/products/products.store';
import { ChartColumnComponent } from '../../shared/charts/chart-column/chart-column.component';
import { ChipsComponent } from '../../shared/chips/chips.component';

@Component({
  selector: 'app-category-detail-orders',
  standalone: true,
  imports: [
    TitleCardComponent,
    ChartColumnComponent,
    MatChipsModule,
    ChipsComponent,
  ],
  templateUrl: './category-detail-orders.component.html',
  styleUrl: './category-detail-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailOrdersComponent {
  private readonly _productStore = inject(ProductsStore);
  public categoryId = input<number>(0);
  protected selectedOrdersYear: any = signal(new Date().getFullYear());
  protected currentYear: any = signal(new Date().getFullYear());

  protected readonly ordersByCategory: Signal<Order[]> = computed(() =>
    this._productStore.findOrdersByCategoryId(this.categoryId())
  );

  protected productionYearChart(year: any) {
    this.selectedOrdersYear.set(year);
    // this.updatedCharts();
  }

  private readonly orderedByMonth = computed(() => {
    console.log(this.ordersByCategory())
    const o: any = {};
    this.ordersByCategory().forEach((order: Order) => {
      const date = new Date(order.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      // const month = date.toLocaleString('default', { month: 'short' });

      if (o.hasOwnProperty(year)) {
        if (o[year].hasOwnProperty(month)) {
          o[year][month] += order.quantity;
        } else {
          o[year][month] = order.quantity;
        }
      } else {
        o[year] = new Array(12).fill(0);
        o[year][month] = order.quantity;
      }
    });

    return o;
  });

  protected readonly orderYears = computed(() =>
    Object.keys(this.orderedByMonth()).reverse()
  );
  
  private readonly orderedByYear = computed(() => {
    const o: any = {};
    this.ordersByCategory().forEach((order: Order) => {
      const date = new Date(order.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      // const month = date.toLocaleString('default', { month: 'short' });

      if (o.hasOwnProperty(year)) {
        if (o.hasOwnProperty(year)) {
          o[year] += order.quantity;
        } else {
          o[year] = order.quantity;
        }
      } else {
        o[year] = order.quantity;
      }
    });

    return o;
  });

  protected orderByMonthChartData = computed(() => [
    {
      name: 'Mesečni nivo',
      data: this.orderedByMonth()[this.selectedOrdersYear()],
    },
  ]);

  protected orderByYearChartData = computed(() => [
    { name: 'Godišnji nivo', data: Object.values(this.orderedByYear()) },
  ]);

  protected orderByYearChartOpt = computed(() => {
    return {
      xaxis: {
        categories: [...Object.keys(this.orderedByYear())],
      },
    };
  });
}
