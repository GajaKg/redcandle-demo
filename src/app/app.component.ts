import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/core/components/sidebar/sidebar.component';
import { ProductsStore } from '@/features/warehouse/store/products.store';
import { ClientsStore } from '@/features/clients/store/clients.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly storeProducts = inject(ProductsStore);
  private readonly storeClients = inject(ClientsStore);
  title = 'Red Candle Management';

  ngOnInit() {
    // this.storeProducts.getCateogries().subscribe();
    this.storeProducts.getProductsOrders().subscribe();
    this.storeClients.getClients();
  }
}
