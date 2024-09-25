import { Component } from '@angular/core';
import { CardComponent } from '../../components/shared/card/card.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CardComponent, RouterOutlet],
  templateUrl: './production.component.html',
  styleUrl: './production.component.scss'
})
export class ProductionComponent {

}
