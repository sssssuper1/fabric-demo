import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { Rect } from './Cropper';
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

  const [dimension, setDimension] = useState<Rect>();

  const crop =useCallback( () => {
    const { width, height } = imageEditor.current!.getCanvasSize();
    setDimension({
      top: 0,
      left: 0,
      width,
      height,
    });
  }, []);

  const move = useCallback((x: number, y: number) => {
    transformRef.current!.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onCrop = useCallback((rect: Rect) => {
    if (!dimension) return;
    const { clientWidth, clientHeight } = contentRef.current!;

    const scale = Math.min(clientWidth / rect.width, clientHeight / rect.height);
    const w = Math.round(rect.width * scale);
    const h = Math.round(rect.height * scale);
    const t = Math.round(rect.top * scale);
    const l = Math.round(rect.left * scale);

    const wOffset = (w - dimension.width) / 2;
    const hOffset = (h - dimension.height) / 2;

    const outLeft = dimension.width * (scale - 1) / 2 - l;
    const outTop = dimension.height * (scale - 1) / 2 - t;

    const x = Math.round(outLeft - wOffset);
    const y = Math.round(outTop - hOffset);

    groupRef.current!.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, [dimension]);

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
        {dimension && <Cropper dimension={dimension} onMove={move} onCrop={onCrop} />}
      </div>
    </div>
  );
};

export default memo(forwardRef(Editor));
