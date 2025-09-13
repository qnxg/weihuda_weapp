import type { CanvasContext as TaroCanvasContext } from '@tarojs/taro'

interface CanvasContext extends TaroCanvasContext {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  createRadialGradient?: Function
}

export class CanvasObject {
  private readonly ctx: CanvasContext
  private readonly node: any
  private event: any
  private chart: any

  constructor(node: any, ctx: CanvasContext) {
    this.ctx = ctx
    this.node = node
    this.ctx.createRadialGradient = function () {
      return ctx.createCircularGradient.apply(ctx, arguments)
    }
    this.initEvent()
  }

  getContext() {
    return this.ctx
  }

  setChart(chart: any) {
    this.chart = chart
  }

  addEventListener() {}

  initEvent() {
    this.event = {}
    const eventNames = [
      {
        wxName: 'touchStart',
        ecName: 'mousedown',
      },
      {
        wxName: 'touchMove',
        ecName: 'mousemove',
      },
      {
        wxName: 'touchEnd',
        ecName: 'mouseup',
      },
      {
        wxName: 'touchEnd',
        ecName: 'click',
      },
    ]

    eventNames.forEach(name => {
      this.event[name.wxName] = (e: any) => {
        const touch = e.touches[0]
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
          zrY: name.wxName === 'tap' ? touch.clientY : touch.y,
        })
      }
    })
  }

  set width(w) {
    if (this.node) this.node.width = w
  }

  set height(h) {
    if (this.node) this.node.height = h
  }

  get width() {
    if (this.node) return this.node.width
    return 0
  }

  get height() {
    if (this.node) return this.node.height
    return 0
  }
}
