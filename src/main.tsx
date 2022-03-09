import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { Rect, Boundary } from './Cropper';
import './main.css';

interface IProps {
  url: string;
}

export interface ImageEditorRef {
  getEditor(): ImageEditor;
  startCrop(): void;
  applyCrop(): void;
}

const Editor: React.ForwardRefRenderFunction<ImageEditorRef, IProps> = ({
  url,
}, ref) => {
  const imageEditor = useRef<ImageEditor | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<Rect | null>(null);

  const [dimension, setDimension] = useState<Rect & Boundary>();

  const startCrop = useCallback(() => {
    const { width, height } = imageEditor.current!.getCanvasSize();
    setDimension({
      top: 0,
      left: 0,
      width,
      height,
      maxWidth: contentRef.current!.clientWidth,
      maxHeight: contentRef.current!.clientHeight,
    });
  }, []);

  const onMove = useCallback((x: number, y: number) => {
    transformRef.current!.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onCommit = useCallback(({ x, y, scale }: { x: number; y: number; scale: number; }) => {
    groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const onCrop = useCallback((rect: Rect) => {
    rectRef.current = { ...rect };
  }, []);

  const cancelCropMode = useCallback(() => {
    setDimension(undefined);
    transformRef.current!.style.transform = 'none';
    groupRef.current!.style.transform = 'none';
  }, []);

  const applyCrop = useCallback(() => {
    if (!rectRef.current) return;
    const { left, top, width, height } = rectRef.current;
    imageEditor.current?.crop(left, top, width, height);
    cancelCropMode();
  }, [cancelCropMode]);

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
    <div className='content' ref={contentRef}>
      <div className='group' ref={groupRef}>
        <div ref={transformRef}>
          <canvas ref={canvasRef} />
        </div>
        {dimension && (
          <Cropper
            dimension={dimension}
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
