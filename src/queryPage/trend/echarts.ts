// 实际使用的是`./echarts.ts`
// devDependency中的`echarts`只起到提供类型注解的作用。

import * as echarts from './echarts.min.cjs';
import type { LineSeriesOption } from 'echarts/charts';
import type { LegendComponentOption, GridComponentOption, TooltipComponentOption } from 'echarts/components';
import type { ComposeOption } from 'echarts/types/dist/shared';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  LineSeriesOption | GridComponentOption |
  TooltipComponentOption | LegendComponentOption
>;

export default echarts