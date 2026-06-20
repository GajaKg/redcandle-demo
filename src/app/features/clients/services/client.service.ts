import { NoToastMessage } from '@/core/constants/http.constants';
import Client from '@/features/clients/types/client.interface';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../orders/types/order.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly url = "/customers"

  constructor(private http: HttpClient) { }

  fetchClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url, {
      context: new HttpContext().set(NoToastMessage, true)
    });
  }

  add(client: Client): Observable<Client> {
    return this.http.post<Client>(this.url, client);
  }

  edit(client: Client): Observable<Client> {
    return this.http.put<Client>(this.url + "/" + client.id, client);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Client>(this.url + "/" + id);
  }

  fetchClientById(id: number): Observable<Client>  {
     return this.http.get<Client>(`${this.url}/${id}`);
  }

  // fetchOrdersByClientId(id: number): Observable<Order[]> {
  //   return this.http.get<Order[]>(`${this.url}/${id}`, {
  //     context: new HttpContext().set(NoToastMessage, true)
  //   });
  // }
}
