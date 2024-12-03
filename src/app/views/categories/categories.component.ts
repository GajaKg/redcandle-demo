import { Component } from '@angular/core';
import { CategoryDetailComponent } from "./category-detail/category-detail.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoryDetailComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

}
