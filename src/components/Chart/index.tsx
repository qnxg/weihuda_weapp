import { Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { CanvasObject } from '@/components/Chart/canvas';

const wrapTouch = (event) => {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
};

let canvasNum = 0;

const getCanvasId = () => `__canvas__${canvasNum++}__`;

interface Props {
  echarts: any;
  option: any;
  canvasId?: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

const Index: React.FC<Props> = ({ canvasId, echarts, option, className, style }) => {
  const [inited, setInited] = useState<boolean>(false);
  const chartInstanceRef = useRef<any>(null);
  const canvasIdRef = useRef<string>(canvasId || getCanvasId());

  const touchStart = useCallback((e) => {
    if (chartInstanceRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const handler = chartInstanceRef.current.getZr().handler;
      handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y
      });
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      });
      handler.processGesture(wrapTouch(e), 'start');
    }
  }, []);

  const touchMove = useCallback((e) => {
    if (chartInstanceRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const handler = chartInstanceRef.current.getZr().handler;
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      });
      handler.processGesture(wrapTouch(e), 'change');
    }
  }, []);

  const touchEnd = useCallback((e) => {
    if (chartInstanceRef.current) {
      const touch = e.changedTouches ? e.changedTouches[0] : {};
      const handler = chartInstanceRef.current.getZr().handler;
      handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y
      });
      handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y
      });
      handler.processGesture(wrapTouch(e), 'end');
    }
  }, []);

  const updateOption = useCallback((op) => {
    op && chartInstanceRef.current?.setOption(op);
  }, []);

  const init = useCallback(
    (ec, op) => {
      Taro.createSelectorQuery()
        .select(`#${canvasIdRef.current}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvasNode = res[0].node;
          const canvasDpr = Taro.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const ctx = canvasNode.getContext('2d');
          const canvas = new CanvasObject(canvasNode, ctx);
          ec.setCanvasCreator(() => {
            return canvas;
          });
          chartInstanceRef.current = ec.init(canvas, null, {
            width: canvasWidth,
            height: canvasHeight,
            devicePixelRatio: canvasDpr
          });
          canvas.setChart(chartInstanceRef.current);
          updateOption(op);
          setInited(true);
        });
    },
    [updateOption]
  );

  useEffect(() => {
    if (inited) {
      updateOption(option);
    } else {
      Taro.nextTick(() => {
        setTimeout(() => {
          init(echarts, option);
        }, 0);
      });
    }
  }, [echarts, init, inited, option, updateOption]);

  return (
    <Canvas
      id={canvasIdRef.current}
      canvasId={canvasIdRef.current}
      type='2d'
      className={className}
      style={{ width: '100%', height: '100%', display: 'inline-block', ...style }}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
    />
  );
};

export default Index;
