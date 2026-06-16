import { inject, Injectable } from "@angular/core";
import { Category } from "../types/category.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  private readonly http = inject(HttpClient)

  private readonly url = "/categories"

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  fetchCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  post(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  put(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, category);
  }

  delete(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.url}/${id}`);
  }
}
