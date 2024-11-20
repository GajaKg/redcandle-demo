import { Component, computed, effect, input, signal } from '@angular/core';
import { ChartBaseComponent } from '../chart-base/chart-base.component';
import { ChartOptionsLine } from '../../../../interfaces/chart.type';
@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent {
  public data = input<any>([]);
  public opt = input<Partial<ChartOptionsLine>>();

  public chartOptions = computed<Partial<ChartOptionsLine>>(() => {
    return {
      series: [
        {
          name: 'Količina',
          data: this.data(),
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left',
      // },
      grid: {
        row: {
          colors: ['#000000', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.3,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
      ...this.opt(),
    };
  });
}
