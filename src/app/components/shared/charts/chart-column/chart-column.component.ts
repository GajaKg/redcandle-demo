import { Component, effect, input, OnInit, ViewChild } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-chart-column',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-column.component.html',
  styleUrl: './chart-column.component.scss',
})
export class ChartColumnComponent {
  public data = input<any>([]);

  @ViewChild('chartObj') chartObj!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      // series: [

      // {
      //   name: 'Žižak',
      //   data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      // },
      // {
      //   name: 'Sveće',
      //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      // },
      // {
      //   name: 'Čašice',
      //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      // },
      // ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          // columnWidth: "80%",
          // endingShape: "rounded"
        },
      },
      dataLabels: {
        enabled: false,
      },
      // stroke: {
      //   show: true,
      //   width: 5,
      //   colors: ["transparent"]
      // },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Maj',
          'Jun',
          'Jul',
          'Avg',
          'Sep',
          'Okt',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    };

    effect(() => {
      this.chartOptions.series = [...this.data()];
 });
  }

  // ngOnInit() {
  //   console.log(this.data())
  //   this.chartOptions.series = [...this.data()];
  // }
}
