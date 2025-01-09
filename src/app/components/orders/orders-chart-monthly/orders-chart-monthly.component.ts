import { Component, computed, input, signal } from '@angular/core';
import { ChipsComponent } from '../../shared/chips/chips.component';
import { ChartColumnComponent } from '../../shared/charts/chart-column/chart-column.component';
import { Order } from '../../../interfaces/order.interface';
import {
  extractChartDataOrdersForMultipleProducts,
  extractChartDataOrdersForSingleProduct,
} from '../../../helpers/helpers';

@Component({
  selector: 'app-orders-chart-monthly',
  standalone: true,
  imports: [ChipsComponent, ChartColumnComponent],
  templateUrl: './orders-chart-monthly.component.html',
  styleUrl: './orders-chart-monthly.component.scss',
})
export class OrdersChartMonthlyComponent {
  public orders = input<Order[]>([]);
  public multipleProducts = input<boolean>(false);

  protected selectedOrdersYear: any = signal(new Date().getFullYear());
  protected currentYear: any = signal(new Date().getFullYear());

  protected ordersByYear = computed(() =>
    this.multipleProducts()
      ? extractChartDataOrdersForMultipleProducts(this.orders())
      : extractChartDataOrdersForSingleProduct(this.orders())
  );

  protected extractYears() {
    if (!this.multipleProducts()) {
      return Object.keys(this.ordersByYear()).reverse();
    }

    const c: any[] = [];
    const years = new Set<number>();
    const o = Object.values(this.ordersByYear());

    o.forEach((val: any) => {
      c.push(...Object.keys(val));
    });

    c.forEach((val) => {
      years.add(+val);
    });

    return Array.from(years).sort().reverse();
  }

  public ordersChartData = computed(() => {
    if (this.multipleProducts()) {
      const chartData: any = [];
      const productsNames = Object.keys(this.ordersByYear());

      productsNames.forEach((productName: string) => {
        chartData.push({
          name: productName,
          data:
            this.ordersByYear()[productName][this.selectedOrdersYear()] || [],
        });
      });

      return chartData;
    } else {
      return [
        {
          name: 'Mesečni nivo',
          data: this.ordersByYear()[this.selectedOrdersYear()],
        },
      ];
    }
  });

  protected orderYearChartHandler(year: any) {
    this.selectedOrdersYear.set(year);
  }
}
