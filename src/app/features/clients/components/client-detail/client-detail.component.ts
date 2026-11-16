import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ActivatedRoute, Params } from '@angular/router';


import Client from '../../types/client.interface';

import { provideNativeDateAdapter } from '@angular/material/core';

import { ClientsStore } from '../../store/clients.store';
import { OrdersChartYearlyComponent } from '../orders/orders-chart-yearly/orders-chart-yearly.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientDetailOrderFormComponent } from '../client-detail-order-form/client-detail-order-form.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { CardComponent } from '@/shared/components/card/card.component';
import { TitleCardComponent } from '@/shared/components/title-card/title-card.component';
import { ClientDetailOrderListComponent } from '../client-detail-order-list/client-detail-order-list.component';
import { OrdersChartMonthlyComponent } from '../orders/orders-chart-monthly/orders-chart-monthly.component';



@Component({
  selector: 'app-client-detail',
  standalone: true,
   providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TitleCardComponent,
    OrdersChartMonthlyComponent,
    OrdersChartYearlyComponent,
    ClientDetailOrderFormComponent,
    ClientDetailOrderListComponent
],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly clientStore = inject(ClientsStore);
  private readonly productStore = inject(ProductsStore);

  protected selectedId = signal<number>(0);
  protected selectedClient: Signal<Client | undefined> = computed(() =>
    this.clientStore.getSelectedClient()
  );

  public orders = computed(() => this.productStore.ordersBySelectedClient());

  ngOnInit() {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe((params: Params) => {
        // this.selectedId = params['id'];
        this.selectedId.set(params['id']);
        this.clientStore.setSelectedClientId(params['id']);
      });
  }

}

