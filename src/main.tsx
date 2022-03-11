import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { Rect, Boundary, Ratio } from './Cropper';
import './main.css';

interface IProps {
  url: string;
  cropRatio?: Ratio;
}

export interface ImageEditorRef {
  getEditor(): ImageEditor;
  startCrop(): void;
  applyCrop(): void;
}

const Editor: React.ForwardRefRenderFunction<ImageEditorRef, IProps> = ({
  url,
  cropRatio,
}, ref) => {
  const imageEditor = useRef<ImageEditor | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<Rect | null>(null);

  const translateRef = useRef({ x: 0, y: 0});

  const [dimension, setDimension] = useState<Rect & Boundary>();
  const [pause, setPause] = useState(true);

  const resetCropStatus = useCallback(() => {
    transformRef.current!.style.transform = 'none';
    groupRef.current!.style.transform = 'none';
    translateRef.current = { x: 0, y: 0 };
  }, []);

  const onCanvasSizeChange = useCallback(({ width, height }: any) => {
    setDimension({
      top: 0,
      left: 0,
      width,
      height,
      maxWidth: contentRef.current!.clientWidth,
      maxHeight: contentRef.current!.clientHeight,
    });
    resetCropStatus();
  }, [resetCropStatus]);

  const startCrop = useCallback(() => {
    const { width, height } = imageEditor.current!.getCanvasSize();
    imageEditor.current?.setMode('crop');
    setDimension(pre => {
      return pre || {
        top: 0,
        left: 0,
        width,
        height,
        maxWidth: contentRef.current!.clientWidth,
        maxHeight: contentRef.current!.clientHeight,
      };
    });
    setPause(false);
    imageEditor.current?.addEventListener('sizeChange', onCanvasSizeChange);
  }, [onCanvasSizeChange]);

  const onMove = useCallback((x: number, y: number) => {
    translateRef.current.x = x;
    translateRef.current.y = y;
    transformRef.current!.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onCommit = useCallback(({ x, y, scale }: { x: number; y: number; scale: number; }) => {
    groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const onCrop = useCallback((rect: Rect) => {
    rectRef.current = { ...rect };
  }, []);

  const applyCrop = useCallback(() => {
    if (!rectRef.current) return;

    const { left, top, width, height } = rectRef.current;
    imageEditor.current?.removeEventListener('sizeChange', onCanvasSizeChange);
    imageEditor.current?.crop(left - translateRef.current.x, top - translateRef.current.y, width, height);
    setPause(true);
  }, [onCanvasSizeChange]);

  useEffect(() => {
    if (imageEditor.current) return;
    const { clientWidth, clientHeight } = contentRef.current!;
    imageEditor.current = new ImageEditor({
      canvasElement: canvasRef.current!,
      maxWidth: clientWidth,
      maxHeight: clientHeight,
    });

    imageEditor.current.setUrl(url);
  }, [url]);

  useImperativeHandle(ref, () => ({
    getEditor: () => imageEditor.current!,
    startCrop,
    applyCrop,
  }));

  return (
    <div className="content" ref={contentRef}>
      <div className={`group ${pause ? 'pause' : ''}`} ref={groupRef}>
        <div className={`${pause ? 'pause' : ''}`} ref={transformRef}>
          <canvas ref={canvasRef} />
        </div>
        {dimension && (
          <Cropper
            visible={!pause}
            dimension={dimension}
            ratio={cropRatio}
            onMove={onMove}
            onCommit={onCommit}
            onCrop={onCrop}
          />
        )}
      </div>
    </div>
  );
};

export default memo(forwardRef(Editor));
