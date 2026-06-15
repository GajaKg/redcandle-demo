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

  // delete(id: number): Observable<Category> {
  //   return this.http.delete<Category>(this.url + "/" + id);
  // }
}
