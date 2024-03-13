
import { Chart } from '@/apis/hdjw/chart';
import { ECOption } from './echarts';

export default function (mode: number, data: Chart): ECOption {
  return {
    color: ['#808080', '#328ccb'],
    grid: {
      top: 35,
      bottom: 5,
      left: '15%',
      right: '15%'
    },
    legend: {
      show: true,
      textStyle: {
        color: '#8c8c8c'
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: '#FAFAFA',
      confine: true,
      textStyle: {
        color: '#666666'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.semester,
      show: false
    },
    yAxis: [
      {
        name: '排名',
        type: 'value',
        inverse: true,
        offset: 20,
        nameLocation: 'start',
        nameTextStyle: {
          align: 'center',
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
          align: 'center'
        },
        splitLine: {
          lineStyle: {
            color: ['#E2E2E2'],
            width: 1
          }
        }
      },
      {
        name: mode === 1 ? '绩点' : '分数',
        type: 'value',
        offset: 20,
        nameLocation: 'end',
        nameTextStyle: {
          align: 'center',
          color: '#8c8c8c'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#328ccb',
          margin: 0,
          align: 'center'
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
        name: '排名',
        type: 'line',
        smooth: true,
        data: mode === 0 ? data.weightAvgRank : mode === 1 ? data.GPARank : data.CoreWeightAvgRank,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        }
      },
      {
        name: mode === 1 ? '绩点' : '分数',
        type: 'line',
        smooth: true,
        data: mode === 0 ? data.weightAvg : mode === 1 ? data.GPA : data.CoreWeightAvg,
        yAxisIndex: 1,
        symbol: 'emptyCircle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        }
      }
    ]
  };
}
