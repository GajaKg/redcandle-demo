import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  fetchOrders(): Observable<any[]> {
    return this.http.get<any[]>('data/orders.json');
  }
}
