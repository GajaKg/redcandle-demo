import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { TitleCardComponent } from '../../../../components/shared/title-card/title-card.component';
import { ProductsStore } from '../../../../store/products/products.store';
import { Order } from '../../../../interfaces/order.interface';
import { OrdersChartMonthlyComponent } from "../../../../components/orders/orders-chart-monthly/orders-chart-monthly.component";
import { OrdersChartYearlyComponent } from "../../../../components/orders/orders-chart-yearly/orders-chart-yearly.component";

@Component({
  selector: 'app-product-orders',
  standalone: true,
  imports: [
    TitleCardComponent,
    MatChipsModule,
    MatTabsModule,
    OrdersChartMonthlyComponent,
    OrdersChartYearlyComponent
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

  protected setActiveTab(index: number) {
    this.activeTab.set(index);
  }

}
