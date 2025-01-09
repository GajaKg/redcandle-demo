import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Order } from '../../../interfaces/order.interface';
import { ChartColumnComponent } from '../../shared/charts/chart-column/chart-column.component';
import { extractChartDataOrdersYearlyForMultipleProducts } from '../../../helpers/helpers';

@Component({
  selector: 'app-orders-chart-yearly',
  standalone: true,
  imports: [ChartColumnComponent],
  templateUrl: './orders-chart-yearly.component.html',
  styleUrl: './orders-chart-yearly.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersChartYearlyComponent {
  public orders = input<Order[]>([]);
  public multipleProducts = input<boolean>(false);

  protected sumOrdersByYear = computed(() => {
    if (this.multipleProducts()) {
      return extractChartDataOrdersYearlyForMultipleProducts(this.orders());
      // const chartData: any = [];
      // const productsNames = Object.keys(extracted);
      // console.log('order', extracted);
      // console.log('productsNames', productsNames);

      // productsNames.forEach((productName: string) => {
      //   chartData.push({
      //     name: productName,
      //     data: Object.values(extracted[productName]),
      //     // data: [extracted[productName][2022], extracted[productName][2023], extracted[productName][2024]],
      //   });
      // });
      // console.log('chartData', chartData);
      // return chartData;
    }

    const o: any = {};
    this.orders().forEach((order: Order) => {
      const date = new Date(order.date);
      const year = date.getFullYear();

      if (o.hasOwnProperty(year)) {
        o[year] += order.quantity;
      } else {
        o[year] = order.quantity;
      }
    });
    return o;
  });

  protected orderYearsChartData = computed(() => {
    if (this.multipleProducts()) {
      const preparedOrders = this.sumOrdersByYear();
      console.log('preparedOrders', preparedOrders);

      const chartData: any = [];
      const productsNames = Object.keys(preparedOrders);
      const years = new Set<number>();

      productsNames.forEach((productName: string) => {
        const qq = Object.keys(preparedOrders[productName]);
        const asd: any[] = [];
        qq.forEach((val) => {
          years.add(+val);
        });
        years.forEach((val) => {
          asd.push(preparedOrders[productName][val]);
        });

        chartData.push({
          name: productName,
          data: [...asd],
          // data: Object.values(extracted[productName]),
          // data: [extracted[productName][2022], extracted[productName][2023], extracted[productName][2024]],
        });
      });
      // console.log('years', years);
      // console.log('chartData', chartData);
      return chartData;
    } else {
      return [{ data: Object.values(this.sumOrdersByYear()) }];
    }
  });

  private extractYears = computed(() => {
    const preparedOrders = this.sumOrdersByYear();
    const productsNames = Object.keys(preparedOrders);
    const years = new Set<number>();

    productsNames.forEach((productName: string) => {
      const qq = Object.keys(preparedOrders[productName]);
      qq.forEach((val) => {
        years.add(+val);
      });
    });
    return Array.from(years);
  });

  protected ordersChartOptions = computed(() => {
    const xAxis = this.multipleProducts()
      ? this.extractYears()
      : Object.keys(this.sumOrdersByYear());

    return {
      xaxis: {
        categories: xAxis,
      },
    };
  });
}
