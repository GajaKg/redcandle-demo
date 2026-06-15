export const chartColumnOptions: any = {
  series: [],
  chart: {
    type: 'bar',
    height: 350,
    width: '100%'
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
      formatter: function (val: any) {
        return '$ ' + val + ' thousands';
      },
    },
  },
  theme: {
    mode: 'dark',
    palette: 'palette7',
    // monochrome: {
    //   enabled: false,
    //   color: '#255aee',
    //   shadeTo: 'light',
    //   shadeIntensity: 0.65,
    // },
  },
};
