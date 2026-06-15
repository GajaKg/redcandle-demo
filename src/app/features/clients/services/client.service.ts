import Client from '@/features/clients/types/client.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly url = "/customers"

  constructor(private http: HttpClient) { }

  fetchClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url);
  }

  add(client: Client): Observable<Client> {
    return this.http.post<Client>(this.url + "/" + client.id, client);
  }
}
