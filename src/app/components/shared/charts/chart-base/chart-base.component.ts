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
    this.chartOptions = this.options();

    effect(() => {
      this.chartOptions = this.options();
      this.chartOptions['series'] = [...this.data()];
      this.chartObj.render();
    });
  }
}
