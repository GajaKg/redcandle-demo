import { Order } from '@/features/orders/types/order.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly url = "/orders"

  constructor(private http: HttpClient) { }

  fetchOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  fetchById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  fetchByClientId(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/client-orders/${id}`);
  }
}
