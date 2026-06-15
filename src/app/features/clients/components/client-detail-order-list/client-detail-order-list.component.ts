import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { Order } from '@/features/clients/types/order.interface';

@Component({
  selector: 'app-client-detail-order-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './client-detail-order-list.component.html',
  styleUrl: './client-detail-order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailOrderListComponent {
  private readonly productStore = inject(ProductsStore);

  public orders = computed(() => this.productStore.ordersBySelectedClient());
  public dataSource = new MatTableDataSource<Order[]>(this.orders());
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected displayedColumns: string[] = [
    'id',
    // 'clientId',
    // 'clientName',
    // 'productId',
    'productName',
    'quantity',
    'date',
    'dateDelivery',
    'paid',
    'delivered',
    'note',
    'actions',
  ];

  protected orderDeliveredOldValue = signal<boolean>(false);
  protected orderEditQuantity = signal<number>(0); // diff between old and new amount
  protected selectedId = signal<number>(0);
  protected productQuantity = signal<number>(0);
  protected editOrder = signal<Order | undefined>(undefined);

  onDeleteOrder(id: number) {
    this.productStore.deleteOrder(id);
  }

  onEditOrder(order: Partial<Order>, i: number) {
    this.orderEditQuantity.set(order.quantity!);
    this.orderDeliveredOldValue.set(order.delivered!);
    const product = this.productStore.findProductById(order.productId!);

    const editedOrder: Order = {
      id: order.id!,
      clientId: order.clientId!,
      clientName: order.clientName!,
      productId: order.productId!,
      categoryId: product?.categoryId ?? 0,
      quantity: order.quantity!,
      paid: order.paid ?? false,
      date: new Date(order.date!),
      dateDelivery: new Date(order.dateDelivery!),
      delivered: order.delivered!,
      note: order.note ?? '',
    };

    this.editOrder.set(editedOrder);
    this.productQuantity.set(
      product ? +product.quantity + editedOrder.quantity : 0
    );
  }

  onEditOrderConfirmed() {
    const currentOrder = this.editOrder();
    if (!currentOrder) return;

    const orderDiff = this.orderEditQuantity() - currentOrder.quantity;

    if (currentOrder.quantity <= this.productQuantity()) {
      this.productStore.editOrder(
        currentOrder,
        orderDiff,
        this.orderDeliveredOldValue()
      );
      this.editOrder.set(undefined);
    } else {
      alert('Nemate dovoljnu količinu u magacinu!');
    }
  }

  onCancel() {
    this.editOrder.set(undefined);
  }

  updateDate(newDate: Date) {
    const current = this.editOrder();
    if (current) {
      this.editOrder.set({ ...current, date: newDate });
    }
  }

  updateDateDelivery(newDate: Date) {
    const current = this.editOrder();
    if (current) {
      this.editOrder.set({ ...current, dateDelivery: newDate });
    }
  }
}
