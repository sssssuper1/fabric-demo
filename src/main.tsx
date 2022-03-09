import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { Rect, Boundary } from './Cropper';
import './main.css';

interface IProps {
  url: string;
}

export interface ImageEditorRef {
  editor: ImageEditor;
  crop(): void;
}

const Editor: React.ForwardRefRenderFunction<ImageEditorRef, IProps> = ({
  url,
}, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageEditor = useRef<ImageEditor | null>(null);
  const transformRef = useRef<HTMLDivElement>(null);

  const [dimension, setDimension] = useState<Rect & Boundary>();

  const crop = useCallback(() => {
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

  const onCrop = useCallback(({ x, y, scale }: { x: number; y: number; scale: number; }) => {
    groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  useImperativeHandle(ref, () => ({
    editor: imageEditor.current!,
    crop,
  }));

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
  return (
    <div className='content' ref={contentRef}>
      <div className='group' ref={groupRef}>
        <div ref={transformRef}>
          <canvas ref={canvasRef} />
        </div>
        {dimension && <Cropper dimension={dimension} onMove={onMove} onCrop={onCrop} />}
      </div>
    </div>
  );
};

export default memo(forwardRef(Editor));
