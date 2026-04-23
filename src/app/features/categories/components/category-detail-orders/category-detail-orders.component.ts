import { ChartColumnComponent } from '@/core/components/shared/charts/chart-column/chart-column.component';
import { TitleCardComponent } from '@/core/components/shared/title-card/title-card.component';
import { OrdersChartMonthlyComponent } from '@/features/clients/components/orders/orders-chart-monthly/orders-chart-monthly.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Order } from '@/features/clients/types/order.interface';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-category-detail-orders',
  standalone: true,
  imports: [
    TitleCardComponent,
    ChartColumnComponent,
    MatChipsModule,
    OrdersChartMonthlyComponent
],
  templateUrl: './category-detail-orders.component.html',
  styleUrl: './category-detail-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailOrdersComponent {
  private readonly _productStore = inject(ProductsStore);
  public categoryId = input<number>(0);

  protected readonly ordersByCategory: Signal<Order[]> = computed(() =>
    this._productStore.findOrdersByCategoryId(this.categoryId())
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
