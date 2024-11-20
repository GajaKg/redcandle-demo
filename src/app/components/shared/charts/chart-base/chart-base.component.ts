import { Component, computed, input, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

import { chartColumnOptions } from '../chart-column-options';
import {
  ChartOptionsColumn,
  ChartOptionsLine,
  ChartOptionsPie,
} from '../../../../interfaces/chart.type';

@Component({
  selector: 'app-chart-base',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-base.component.html',
  styleUrl: './chart-base.component.scss',
})
export class ChartBaseComponent {
  public readonly options = input<ChartOptionsColumn | ChartOptionsPie | ChartOptionsLine | any>(
    chartColumnOptions
  );

  @ViewChild('chartObj') chartObj!: ChartComponent;

  protected chartOptions = computed<ChartOptionsColumn | ChartOptionsPie | ChartOptionsLine | any>(
    () => {
      return {
        ...this.options(),
      };
    }
  );

}
