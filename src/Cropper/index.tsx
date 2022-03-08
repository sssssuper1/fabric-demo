import React, { memo, useRef, useState } from 'react';
import './index.css';

export interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}
 
export interface IProps {
  dimension: Rect;
  onMove(x: number, y: number): void;
  onCrop(rect: Rect): void;
}

type Sides = "n" | "s" | "w" | "e" | "nw" | "ne" | "sw" | "se" | "move";

type Num4 = [number, number, number, number];

type Num2 = [number, number];

const borderWidth = 2;

const calculateDimensino = (dx: number, dy: number, current: Rect, side: Sides, limit: Num4) => {
  const rect = { ...current };
  if (side.includes('s')) {
    rect.height += Math.min(dy, limit[3]);
  }

  if (side.includes('e')) {
    rect.width += Math.min(dx, limit[1]);
  }

  if (side.includes('n')) {
    const limitedDy = Math.max(dy, limit[2]);
    rect.top += limitedDy;
    rect.height -= limitedDy;
  }

  if (side.includes('w')) {
    const limitedDx = Math.max(dx, limit[0]);
    rect.left += limitedDx;
    rect.width -= limitedDx;
  }

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
  console.log(outer, inner);
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

const Cropper: React.FC<IProps> = ({
  dimension,
  onMove,
  onCrop,
}) => {
  const [boxStyle] = useState({
    width: dimension.width,
    height: dimension.height,
    top: dimension.top - borderWidth,
    left: dimension.left - borderWidth,
  });

  const [dragging, setDragging] = useState<Sides>();

  const boxRef = useRef<HTMLDivElement>(null);
  const positinoRef = useRef<{ x: number, y: number, side?: Sides }>({ x: 0, y: 0});

  const outPosRef = useRef({ x: 0, y: 0 });
  const outTempRef = useRef({ x: 0, y: 0 });

  const limitRef = useRef<Num4>([0, 0, 0, 0]);

  const mouseDownHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    positinoRef.current.x = e.clientX;
    positinoRef.current.y = e.clientY;
    positinoRef.current.side = (e.target as HTMLElement).dataset.side as Sides;
    limitRef.current = getMaxOffset({
      top: dimension.top + outPosRef.current.y,
      left: dimension.left + outPosRef.current.x,
      width: dimension.width,
      height: dimension.height,
    }, boxStyle);

    setDragging(positinoRef.current.side);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    let dx = e.clientX - positinoRef.current.x;
    let dy = e.clientY - positinoRef.current.y;

    if (positinoRef.current.side === 'move') {
      [dx, dy] = getLimitedOuterDxDy(dx, dy, limitRef.current);
      outTempRef.current.x = dx;
      outTempRef.current.y = dy;
      onMove(outPosRef.current.x + dx, outPosRef.current.y + dy);
    } else {
      const rect = calculateDimensino(dx, dy, boxStyle, positinoRef.current.side!, limitRef.current);

      boxRef.current!.style.width = `${rect.width}px`;
      boxRef.current!.style.height = `${rect.height}px`;
      boxRef.current!.style.top = `${rect.top}px`;
      boxRef.current!.style.left = `${rect.left}px`;
    }
  };

  const mouseUpHandler = () => {
    if (positinoRef.current.side === 'move') {
      outPosRef.current.x += outTempRef.current.x;
      outPosRef.current.y += outTempRef.current.y;
    } else {
      boxStyle.width = boxRef.current!.clientWidth;
      boxStyle.height = boxRef.current!.clientHeight;
      boxStyle.top = converPxToNumber(boxRef.current?.style.top);
      boxStyle.left = converPxToNumber(boxRef.current?.style.left);
      onCrop({ ...boxStyle });
    }
    setDragging(undefined);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  return (
    <div
      className='cropper-box'
      ref={boxRef}
      style={{
        ...boxStyle,
        borderWidth,
      }}
    >
      <i style={getDisplayStyle('s', dragging)} data-side="s" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-s cropper-grip-h' />
      <i style={getDisplayStyle('sw', dragging)} data-side="sw" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-sw cropper-grip-h cropper-grip-v' />
      <i style={getDisplayStyle('w', dragging)} data-side="w" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-w cropper-grip-v' />
      <i style={getDisplayStyle('nw', dragging)} data-side="nw" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-nw cropper-grip-h cropper-grip-v' />
      <i style={getDisplayStyle('n', dragging)} data-side="n" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-n cropper-grip-h' />
      <i style={getDisplayStyle('ne', dragging)} data-side="ne" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-ne cropper-grip-h cropper-grip-v' />
      <i style={getDisplayStyle('e', dragging)} data-side="e" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-e cropper-grip-v' />
      <i style={getDisplayStyle('se', dragging)} data-side="se" onMouseDownCapture={mouseDownHandler} className='cropper-grip cropper-grip-se cropper-grip-h cropper-grip-v' />
      <div data-side="move" onMouseDownCapture={mouseDownHandler} className='cropper-inner' />
    </div>
  );
};

export default memo(Cropper);
 