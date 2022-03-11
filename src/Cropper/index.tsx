import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import './index.css';

type Sides = "n" | "s" | "w" | "e" | "nw" | "ne" | "sw" | "se" | "move";

type Num4 = [number, number, number, number];

type Num2 = [number, number];

export interface Boundary {
  maxWidth: number;
  maxHeight: number;
}

export interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export type Ratio = `${number}x${number}`;
 
export interface IProps {
  visible: boolean;
  dimension: Rect & Boundary;
  ratio?: Ratio;
  onMove(x: number, y: number): void;
  onCommit(rect: ReturnType<typeof getScaleAndTranslation>): void;
  onCrop(rect: Rect): void;
}

const borderWidth = 2;

const initBoxSize = (dimension: Rect, ratio: number) => ({
  width: dimension.width,
  height: dimension.height,
  top: dimension.top - borderWidth * ratio,
  left: dimension.left - borderWidth * ratio,
});

const getAspectByRatio = (x: number, y: number, tx: number, ty: number) => {
  const rectScale = tx / ty;
  const offsetScale = x / y;
  const sign = offsetScale > 0 ? 1 : -1;

  if (Math.abs(offsetScale) > rectScale) {
    x = Math.round(y * rectScale * sign);
  } else if (Math.abs(offsetScale) < rectScale) {
    y = Math.round(x / rectScale * sign);
  }

  return [x, y];
};

const calculateDimensino = (dx: number, dy: number, current: Rect, side: Sides, limit: Num4) => {
  const rect = { ...current };
  let wOffset = dx;
  let hOffset = dy;

  const applyRect: Array<() => void> = [];

  if (side.includes('s')) {
    hOffset = Math.min(dy, limit[3]);
    applyRect.push(() => rect.height += hOffset);
  }

  if (side.includes('e')) {
    wOffset = Math.min(dx, limit[1]);
    applyRect.push(() => rect.width += wOffset);
  }

  if (side.includes('n')) {
    hOffset = Math.max(dy, limit[2]);
    applyRect.push(() => {
      rect.top += hOffset;
      rect.height -= hOffset;
    });
  }

  if (side.includes('w')) {
    wOffset = Math.max(dx, limit[0]);
    applyRect.push(() => {
      rect.left += wOffset;
      rect.width -= wOffset;
    });
  }

  // 等比例缩放
  if (applyRect.length === 2) {
    [wOffset, hOffset] = getAspectByRatio(wOffset, hOffset, current.width, current.height);
  }

  applyRect.forEach(cb => cb());

  return rect;
};

const converPxToNumber = (v?: string) => {
  if (!v) {
    return 0;
  } else if (v.endsWith('px')) {
    return Number(v.slice(0, -2));
  } else {
    return Number(v);
  }
};

const checkGripVisible = (target: Sides, dragging?: Sides) => {
  if (!dragging) return true;
  return target === dragging;
};

const getDisplayStyle = (target: Sides, dragging?: Sides) => {
  return { display: checkGripVisible(target, dragging) ? 'block' : 'none' };
};

const getMaxOffset = (outer: Rect, inner: Rect): Num4 => {
  const dxMin = outer.left - inner.left - borderWidth;
  const dxMax = (outer.width - inner.width) - (inner.left - outer.left) - borderWidth;
  const dyMin = outer.top - inner.top - borderWidth;
  const dyMax = (outer.height - inner.height) - (inner.top - outer.top) - borderWidth;
  return [dxMin, dxMax, dyMin, dyMax];
};

const getLimitedOuterDxDy = (dx: number, dy: number, limit: Num4): Num2 => {
  if (dx < -limit[1]) dx = -limit[1];
  if (dx > -limit[0]) dx = -limit[0];
  if (dy < -limit[3]) dy = -limit[3];
  if (dy > -limit[2]) dy = -limit[2];

  return [dx, dy];
};

const getScale = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  return Math.min(maxWidth / width, maxHeight / height);
};

const getScaleAndTranslation = (inner: Rect, outer: Rect & Boundary) => {
  const { maxWidth, maxHeight, width, height } = outer;

  const scale = getScale(inner.width, inner.height, maxWidth, maxHeight);
  const w = Math.round(inner.width * scale);
  const h = Math.round(inner.height * scale);
  const t = Math.round(inner.top * scale);
  const l = Math.round(inner.left * scale);

  const wOffset = (w - width) / 2;
  const hOffset = (h - height) / 2;

  const outLeft = width * (scale - 1) / 2 - l;
  const outTop = height * (scale - 1) / 2 - t;

  const x = Math.round(outLeft - wOffset);
  const y = Math.round(outTop - hOffset);

  return { x, y, scale };
};

const Cropper: React.FC<IProps> = ({
  visible,
  dimension,
  ratio,
  onMove,
  onCommit,
  onCrop,
}) => {
  const [dragging, setDragging] = useState<Sides>();

  const boxStyle = useRef(initBoxSize(dimension, 1));

  const boxRef = useRef<HTMLDivElement>(null);
  const positinoRef = useRef<{ x: number, y: number, side?: Sides }>({ x: 0, y: 0});

  const outPosRef = useRef({ x: 0, y: 0 });
  // 移动canvas时的定位原点
  const outTempRef = useRef({ x: 0, y: 0 });

  // 限制拖拽范围
  const limitRef = useRef<Num4>([0, 0, 0, 0]);

  // 计算缩放比例造成的拖拽长度
  const realTimeScaleRef = useRef(1);
  const stageScaleRef = useRef(1);

  // 操作移动选框
  const moveBox = useCallback((rect: Partial<Rect>) => {
    if (rect.width) boxRef.current!.style.width = `${rect.width}px`;
    if (rect.height) boxRef.current!.style.height = `${rect.height}px`;
    if (rect.top) boxRef.current!.style.top = `${rect.top}px`;
    if (rect.left) boxRef.current!.style.left = `${rect.left}px`;
  }, []);

  const regressBoxStype = useCallback(() => {
    boxStyle.current.width = boxRef.current!.clientWidth;
    boxStyle.current.height = boxRef.current!.clientHeight;
    boxStyle.current.top = converPxToNumber(boxRef.current?.style.top);
    boxStyle.current.left = converPxToNumber(boxRef.current?.style.left);
  }, []);

  // 鼠标按下
  const mouseDownHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    positinoRef.current.x = e.clientX;
    positinoRef.current.y = e.clientY;
    positinoRef.current.side = (e.target as HTMLElement).dataset.side as Sides;
    limitRef.current = getMaxOffset({
      top: dimension.top + outPosRef.current.y,
      left: dimension.left + outPosRef.current.x,
      width: dimension.width,
      height: dimension.height,
    }, boxStyle.current);

    setDragging(positinoRef.current.side);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // 鼠标移动（拖拽）
  const mouseMoveHandler = (e: MouseEvent) => {
    let dScale = 1;
    if (stageScaleRef.current > 1) {
      // 放大时反比例倍速扩大
      dScale = realTimeScaleRef.current < stageScaleRef.current ? (1 / stageScaleRef.current) : stageScaleRef.current;
    }

    let dx = (e.clientX - positinoRef.current.x) / dScale;
    let dy = (e.clientY - positinoRef.current.y) / dScale;

    if (positinoRef.current.side === 'move') {
      [dx, dy] = getLimitedOuterDxDy(dx, dy, limitRef.current);
      outTempRef.current.x = dx;
      outTempRef.current.y = dy;
      onMove(outPosRef.current.x + dx, outPosRef.current.y + dy);
    } else {
      const rect = calculateDimensino(dx, dy, boxStyle.current, positinoRef.current.side!, limitRef.current);
      moveBox(rect);

      const newScale = getScale(rect.width, rect.height, dimension.maxWidth, dimension.maxHeight);
      realTimeScaleRef.current = newScale;

      // 放大时实时更新canvas缩放
      if (stageScaleRef.current > 1 && newScale < stageScaleRef.current) {
        commitMovement(rect);
      }
    }
  };

  // 鼠标抬起
  const mouseUpHandler = () => {
    if (positinoRef.current.side === 'move') {
      outPosRef.current.x += outTempRef.current.x;
      outPosRef.current.y += outTempRef.current.y;
    } else {
      regressBoxStype();
      stageScaleRef.current = commitMovement(boxStyle.current).scale;
    }
    onCrop(initBoxSize(boxStyle.current, -1));
    setDragging(undefined);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  // 改变整体缩放
  const commitMovement = useCallback((rect: Rect) => {
    const transformInfo = getScaleAndTranslation(rect, dimension);
    onCommit(transformInfo);
    return transformInfo;
  }, [onCommit]);

  // TODO canvas大小改变时(旋转)，重置选框大小及位置
  useEffect(() => {
    boxStyle.current = initBoxSize(dimension, 1);
    moveBox(boxStyle.current);
    onCrop(dimension);
    outPosRef.current = { x: 0, y: 0 };
    realTimeScaleRef.current = 1;
    stageScaleRef.current = 1;
  }, [dimension]);

  useEffect(() => {
    if (!ratio) return;
    const { width, height } = boxStyle.current;
    const [x, y] = ratio.split('x').map(Number);

    const [w, h] = getAspectByRatio(width, height, x, y);

    moveBox({ width: w, height: h });
    regressBoxStype();
    stageScaleRef.current = commitMovement(boxStyle.current).scale;
  }, [ratio]);

  return (
    <div
      className='cropper-box'
      ref={boxRef}
      style={{
        display: visible ? 'block' : 'none',
        ...boxStyle,
        borderWidth,
      }}
    >
      {!ratio && <i style={getDisplayStyle('s', dragging)} data-side="s" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-s cropper-grip-h' />}
      <i style={getDisplayStyle('sw', dragging)} data-side="sw" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-sw cropper-grip-h cropper-grip-v' />
      {!ratio && <i style={getDisplayStyle('w', dragging)} data-side="w" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-w cropper-grip-v' />}
      <i style={getDisplayStyle('nw', dragging)} data-side="nw" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-nw cropper-grip-h cropper-grip-v' />
      {!ratio && <i style={getDisplayStyle('n', dragging)} data-side="n" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-n cropper-grip-h' />}
      <i style={getDisplayStyle('ne', dragging)} data-side="ne" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-ne cropper-grip-h cropper-grip-v' />
      {!ratio && <i style={getDisplayStyle('e', dragging)} data-side="e" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-e cropper-grip-v' />}
      <i style={getDisplayStyle('se', dragging)} data-side="se" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-se cropper-grip-h cropper-grip-v' />
      <div data-side="move" onMouseDownCapture={mouseDownHandler} className='cropper-inner' />
    </div>
  );
};

export default memo(Cropper);
 