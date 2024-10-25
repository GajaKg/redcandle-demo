import { Component, effect, input } from "@angular/core";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { ChartBaseComponent } from "../chart-base/chart-base.component";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [ChartBaseComponent],
  templateUrl: './chart-pie.component.html',
  styleUrl: './chart-pie.component.scss'
})
export class ChartPieComponent {
  public data = input<any>([]);
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      // series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Slobodan prostor", "Zauzeto"],
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200
      //       },
      //       legend: {
      //         position: "bottom"
      //       }
      //     }
      //   }
      // ]
    };

    effect(() => {
      this.chartOptions.series = this.data();
    })

  }
}
