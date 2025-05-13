import { LineSeriesOption } from 'echarts/charts';
import { LegendComponentOption, GridComponentOption, TooltipComponentOption } from 'echarts/components';
// @ts-ignore
import * as echarts from './echarts.min';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption | LegendComponentOption
>;

export default echarts;
