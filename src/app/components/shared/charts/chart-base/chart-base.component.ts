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
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

export type ChartOptionsColumn = {
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

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

import { chartColumnOptions } from '../chart-column-options';

@Component({
  selector: 'app-chart-base',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-base.component.html',
  styleUrl: './chart-base.component.scss',
})
export class ChartBaseComponent {
  public data = input<[]>([]);
  public options =
    input<Partial<ChartOptionsColumn | ChartOptionsPie | any>>(
      chartColumnOptions
    );

  @ViewChild('chartObj') chartObj!: ChartComponent;
  public chartOptions: Partial<ChartOptionsColumn | ChartOptionsPie | any>;

  constructor() {
    // this.chartOptions = this.options();
    // console.log(this.chartOptions)
    this.chartOptions = this.options();

    //   // series: [

    //   // {
    //   //   name: 'Žižak',
    //   //   data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    //   // },
    //   // {
    //   //   name: 'Sveće',
    //   //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    //   // },
    //   // {
    //   //   name: 'Čašice',
    //   //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    //   // },
    //   // ],
    //   chart: {
    //     type: 'bar',
    //     height: 350,
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       // columnWidth: "80%",
    //       // endingShape: "rounded"
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   // stroke: {
    //   //   show: true,
    //   //   width: 5,
    //   //   colors: ["transparent"]
    //   // },
    //   xaxis: {
    //     categories: [
    //       'Jan',
    //       'Feb',
    //       'Mar',
    //       'Apr',
    //       'Maj',
    //       'Jun',
    //       'Jul',
    //       'Avg',
    //       'Sep',
    //       'Okt',
    //       'Nov',
    //       'Dec',
    //     ],
    //   },
    //   yaxis: {
    //     title: {
    //       text: '$ (thousands)',
    //     },
    //   },
    //   fill: {
    //     opacity: 1,
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (val) {
    //         return '$ ' + val + ' thousands';
    //       },
    //     },
    //   },
    // };
    effect(() => {
      this.chartOptions = this.options();
      // this.chartOptions.colors = ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'];
      this.chartOptions['series'] = [...this.data()];
      this.chartObj.render();
    });
  }

  // ngOnInit() {
  //   console.log(this.data());
  // }
}
