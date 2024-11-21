import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient)

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('data/products.json');
  }

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('data/categories.json');
  }
}
