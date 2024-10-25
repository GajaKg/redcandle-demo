import { Component, effect, input } from '@angular/core';

import { ChartBaseComponent } from '../chart-base/chart-base.component';

@Component({
  selector: 'app-chart-column',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-column.component.html',
  styleUrl: './chart-column.component.scss',
})
export class ChartColumnComponent {
  public data = input<any>([]);
}
