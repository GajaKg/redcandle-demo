import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CardComponent } from './components/shared/card/card.component';
import { ClientsComponent } from './views/clients/clients.component';
import { ProductsStore } from './store/products/products.store';
import { ClientsStore } from './store/clients/clients.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CardComponent, ClientsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly storeProducts = inject(ProductsStore);
  private readonly storeClients = inject(ClientsStore);
  title = 'Red Candle Management';

  ngOnInit() {
    this.storeProducts.getProductsOrders();
    this.storeClients.getClients();
  }
}
