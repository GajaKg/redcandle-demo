import { Order } from '@/features/clients/types/order.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  fetchOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('data/orders.json');
  }
}
