import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Order } from '@/features/orders/types/order.interface';
import { MatFormField, MatLabel } from "@angular/material/form-field";

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
    MatLabel
],
  templateUrl: './client-detail-order-list.component.html',
  styleUrls: ['./client-detail-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailOrderListComponent {
  private readonly productStore = inject(ProductsStore);

  // Input: array of orders (required)
  orders = input.required<Order[]>();

  // DataSource computed from orders
  dataSource = computed(() => new MatTableDataSource<Order>(this.orders()));

  // Track expanded order by ID
  expandedId = signal<number | null>(null);

  // Columns displayed in the main table
  columnsToDisplay: string[] = [
    'id',
    'date',
    'paid',
    'delivered',
    'note',
    // 'expand',
    // 'actions',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  // Edit state
  editOrder = signal<Order | undefined>(undefined);

  // Toggle expansion
  toggle(order: Order): void {
    this.expandedId.set(this.expandedId() === order.id ? null : order.id);
  }

  // Check if a row is expanded
  isExpanded(order: Order): boolean {
    return this.expandedId() === order.id;
  }

  // ---- Actions (edit/delete) ----
  onDeleteOrder(id: number) {
    this.productStore.deleteOrder(id);
  }

  onEditOrder(order: Order, index: number) {
    // placeholder – implement your edit logic
    console.log('Edit order', order);
  }

  onEditOrderConfirmed() {
    // placeholder – confirm edit
  }

  onCancel() {
    this.editOrder.set(undefined);
  }
}
