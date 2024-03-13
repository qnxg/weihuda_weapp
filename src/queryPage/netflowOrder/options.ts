import { Chart } from './interface';

export default function (data: Chart): object {
  return {
    title: {
      show: false
    },
    visualMap: {
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 200
    },
    color: ['#808080', '#328ccb'],
    grid: {
      bottom: '60%'
    },
    legend: {
      show: true,
      textStyle: {
        color: '#8c8c8c'
      }
    },
    tooltip: {
      // show: true,
      trigger: 'axis'
      // backgroundColor: '#FAFAFA',
      // confine: true,
      // textStyle: {
      //   color: '#666666'
      // }
    },
    xAxis: {
      data: data.Month,
      axisLabel: { rotate: 45 }
      // show: false
    },
    yAxis: [
      {
        name: '流量(G)',
        type: 'value',
        offset: 13,
        nameLocation: 'end',
        nameTextStyle: {
          align: 'middle',
          color: '#8c8c8c'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#8c8c8c',
          margin: 0,
          align: 'middle'
        },
        splitLine: {
          lineStyle: {
            color: ['#E2E2E2'],
            width: 1
          }
        }
      }
    ],
    series: [
      {
        name: '上传流量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data.Upload
      },
      {
        name: '下载流量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data.Download
      }
    ]
  };
}
