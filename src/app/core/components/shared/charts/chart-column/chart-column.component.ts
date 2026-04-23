import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ChartBaseComponent } from '../chart-base/chart-base.component';
import { chartColumnOptions } from '../chart-column-options';
import { ChartOptionsColumn } from '@/interfaces/chart.type';

@Component({
  selector: 'app-chart-column',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-column.component.html',
  styleUrl: './chart-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
