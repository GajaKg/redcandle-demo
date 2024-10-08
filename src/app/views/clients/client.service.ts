import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Client from '../../interfaces/client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  fetchClients(): Observable<Client[]> {
    return this.http.get<Client[]>('data/clients.json');
  }
}
