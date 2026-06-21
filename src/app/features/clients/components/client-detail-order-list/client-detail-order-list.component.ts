import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Order } from '@/features/orders/types/order.interface';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-client-detail-order-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    DatePipe,
    MatFormField,
    MatLabel,
    MatPaginator
  ],
  templateUrl: './client-detail-order-list.component.html',
  styleUrls: ['./client-detail-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailOrderListComponent {
  private readonly productStore = inject(ProductsStore);

  orders = input.required<Order[]>();

  // DataSource computed from orders
  // dataSource = computed(() => new MatTableDataSource<Order>(this.orders()));
  dataSource = new MatTableDataSource<Order>([]);
  // dataSource = signal(new MatTableDataSource<Order>([]));
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  expandedId = signal<number | null>(null);

  // Columns displayed in the main table
  columnsToDisplay: string[] = [
    'id',
    'date',
    'paid',
    'delivered',
    'note',
    // 'expand',
    'actions',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  editOrder = signal<Order | undefined>(undefined);

  constructor() {
    // Update dataSource.data whenever orders changes
    effect(() => {
      this.dataSource.data = this.orders();
      // If you have sorting, also reset sort here if needed
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Toggle expansion
  toggle(order: Order): void {
    this.expandedId.set(this.expandedId() === order.id ? null : order.id);
  }

  isExpanded(order: Order): boolean {
    return this.expandedId() === order.id;
  }

  onDeleteOrder(id: number) {
    this.productStore.deleteOrder(id);
  }

  onEditOrder(order: Order, index: number) {
    console.log('Edit order', order);
  }

  onEditOrderConfirmed() {
  }

  onCancel() {
    this.editOrder.set(undefined);
  }
}
