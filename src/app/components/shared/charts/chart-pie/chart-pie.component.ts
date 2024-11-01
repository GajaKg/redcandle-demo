import { Component, effect, input } from '@angular/core';
import { ChartBaseComponent } from '../chart-base/chart-base.component';
import { ChartOptionsPie } from '../../../../interfaces/chart.type';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-pie.component.html',
  styleUrl: './chart-pie.component.scss',
})
export class ChartPieComponent {
  public data = input<any>([]);
  public chartOptions: Partial<ChartOptionsPie>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Zauzeto', 'Slobodan prostor'],
      dataLabels: {
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
      tooltip: {
        y: {
          formatter: function (val, opts) {
            //  let percent = opts.globals.seriesPercent[opts.seriesIndex][opts.dataPointIndex];
            const percent = opts.globals.seriesPercent[opts.seriesIndex][0];
            const value = percent ? percent.toFixed(0) + '%' : percent + '%';
            return `<span class='text-white'>${value}</span>`;
          },
          title: {
            formatter: function (seriesName) {
              return `<span class='text-white'>${seriesName}: </span>`;
            },
          },
        },
      },
      legend: {
        formatter: function (legendName) {
          return `<span class='text-white'>${legendName}</span>`;
        },
      },
    };

    effect(() => {
      this.chartOptions.series = this.data();
    });
  }
}
