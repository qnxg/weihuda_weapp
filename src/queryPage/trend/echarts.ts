// @ts-expect-error 这个文件来自apache的echarts，为了精简打包大小做了裁剪
import * as echarts from './echarts.min';
import type { LineSeriesOption } from 'echarts/charts';
import type { LegendComponentOption, GridComponentOption, TooltipComponentOption } from 'echarts/components';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption | LegendComponentOption
>;

export default echarts;
