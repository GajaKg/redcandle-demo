import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CardComponent } from '../../../components/shared/card/card.component';
import { TitleCardComponent } from '../../../components/shared/title-card/title-card.component';

import { ClientsStore } from '../../../store/clients/clients.store';
import Client from '../../../interfaces/client.interface';
import { OrdersStore } from '../../../store/orders/orders.store';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TitleCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientStore = inject(ClientsStore);
  private readonly orderStore = inject(OrdersStore);
  private readonly formBuilder = inject(FormBuilder);
  protected form!: FormGroup;

  protected readonly today = new FormControl(new Date());

  protected selectedClient: Signal<Client | undefined> = computed(() =>
    this.clientStore.getSelectedClient()
  );

  // public orders = computed(() => this.orderStore.orders());
  public orders = computed(() => {
    console.log(this.orderStore.ordersBySelectedClient())
    return this.orderStore.ordersBySelectedClient();
  });

  public dataSource = new MatTableDataSource<any>(this.orders());
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected displayedColumns: string[] = [
    'id',
    // 'clientId',
    // 'clientName',
    // 'productId',
    'productName',
    'quantity',
    'paid',
    'date',
    'dateDelivery',
    'note',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.orders();
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      // this.selectedId = params['id'];
      this.clientStore.setSelectedClientId(params['id']);
    });

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      paid: ['', Validators.required],
      note: [''],
      date: ['', Validators.required],
      dateDelivery: ['', Validators.required],
    });
  }

  onSubmit() {}

  onDeleteOrder(id: number) {}
}
