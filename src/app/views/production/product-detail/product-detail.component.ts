import { Component } from '@angular/core';
import { CardComponent } from "../../../components/shared/card/card.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

}
