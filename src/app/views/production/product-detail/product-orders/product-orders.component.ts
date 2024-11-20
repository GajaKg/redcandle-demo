import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { TitleCardComponent } from '../../../../components/shared/title-card/title-card.component';
import { ProductsStore } from '../../../../store/products/products.store';
import { Order } from '../../../../interfaces/order.interface';
import { ChartLineComponent } from '../../../../components/shared/charts/chart-line/chart-line.component';

@Component({
  selector: 'app-product-orders',
  standalone: true,
  imports: [
    TitleCardComponent,
    ChartLineComponent,
    MatChipsModule,
    MatTabsModule,
  ],
  templateUrl: './product-orders.component.html',
  styleUrl: './product-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductOrdersComponent {
  // private readonly route = inject(ActivatedRoute);
  protected _productStore = inject(ProductsStore);
  protected productId!: number;

  protected activeTab = signal(0);
  protected selectedYear = signal(new Date().getFullYear());

  protected productOrders = computed(() =>
    this._productStore.selectedProductOrders()
  );

  protected sumOrdersByYear = computed(() => {
    const o: any = {};
    this.productOrders().forEach((order: Order) => {
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

  protected orderYearsKeys = computed(() => {
    return Object.keys(this.sumOrdersByYear()).reverse();
  });

  protected orderYearsValues = computed(() => {
    return Object.values(this.sumOrdersByYear());
  });

  protected productOrdersOptionsLineChart = computed(() => {
    return {
      xaxis: {
        categories: Object.keys(this.sumOrdersByYear()),
      },
    };
  });


  //********* CHART BY MONTH ************//
  protected sumOrdersByMonth = computed(() => {
    const o: any = {};
    this.productOrders().forEach((order: Order) => {
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

  protected orderByMonthValues = computed(() => {
    return this.sumOrdersByMonth()[this.selectedYear()];
  });

  protected productOrdersMonthlyOptionsLineChart = computed(() => {
    return {
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mart',
          'April',
          'Maj',
          'Jun',
          'Jul',
          'Avg',
          'Sep',
          'Okt',
          'Nov',
          'Dec',
        ],
      },
    };
  });

  protected setActiveTab(index: number) {
    this.activeTab.set(index);
  }
  protected changeOrdersYear(year: number) {
    this.selectedYear.set(year);
  }
  //********* end CHART BY MONTH end *************//
}
