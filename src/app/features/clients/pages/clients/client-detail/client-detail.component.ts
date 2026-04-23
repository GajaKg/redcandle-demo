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

import { provideNativeDateAdapter } from '@angular/material/core';

import { ClientDetailOrderFormComponent } from "./client-detail-order-form/client-detail-order-form.component";
import { ClientDetailOrderListComponent } from "./client-detail-order-list/client-detail-order-list.component";
import { TitleCardComponent } from '@/core/components/shared/title-card/title-card.component';
import { CardComponent } from '@/core/components/shared/card/card.component';
import { OrdersChartMonthlyComponent } from '@/features/clients/components/orders/orders-chart-monthly/orders-chart-monthly.component';
import { OrdersChartYearlyComponent } from '@/features/clients/components/orders/orders-chart-yearly/orders-chart-yearly.component';
import { ClientsStore } from '@/features/clients/store/clients.store';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import Client from '@/features/clients/types/client.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


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

