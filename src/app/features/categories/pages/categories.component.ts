import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryDetailComponent } from "./category-detail/category-detail.component";

@Component({
    selector: 'app-categories',
    imports: [CategoryDetailComponent],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {

}
