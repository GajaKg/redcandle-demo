import { Component, computed, input } from '@angular/core';

import { ChartBaseComponent } from '../chart-base/chart-base.component';
import { ChartOptionsColumn } from '../../../../interfaces/chart.type';
import { chartColumnOptions } from '../chart-column-options';
@Component({
  selector: 'app-chart-column',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-column.component.html',
  styleUrl: './chart-column.component.scss',
})
export class ChartColumnComponent {
  public data = input<any>([]);
  public opt = input<Partial<ChartOptionsColumn>>({});

  public chartOptions = computed<Partial<ChartOptionsColumn>>(() => {
    return {
      ...chartColumnOptions,
      series: this.data(),
      ...this.opt(),
    };
  });
}
