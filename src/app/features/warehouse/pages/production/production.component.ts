import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './production.component.html',
  styleUrl: './production.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionComponent {

}
