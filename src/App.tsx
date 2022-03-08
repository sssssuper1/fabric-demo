import React, { useCallback, useEffect, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { Rect } from './Cropper';
import './App.css';

const demo = 'https://s.newscdn.cn/file/2022/02/17ecd7bb-6475-4dad-8662-af0f935cb60a.jpeg';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageEditor = useRef<ImageEditor | null>(null);
  const transformRef = useRef<HTMLDivElement>(null);

  const [dimension, setDimension] = useState<Rect>();

  const addFilter = () => {
    imageEditor.current?.setFilter('Sharpen');
  };

  const rotate = () => {
    imageEditor.current?.rotate(270);
  };

  const flipX = () => {
    imageEditor.current?.flip('x');
  };

  const flipY = () => {
    imageEditor.current?.flip('y');
  };

  const mosaic = () => {
    imageEditor.current?.addMosaic();
  };

  const undo = () => {
    imageEditor.current?.undo();
  };

  const redo = () => {
    imageEditor.current?.redo();
  };

  const crop = () => {
    const { clientWidth, clientHeight } = contentRef.current!;
    const { width, height } = imageEditor.current!.getCanvasSize();
    setDimension({
      top: Math.floor((clientHeight - height) / 2),
      left: Math.floor((clientWidth - width) / 2),
      width,
      height,
    });
  };

  const move = useCallback((x: number, y: number) => {
    transformRef.current!.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  useEffect(() => {
    const { clientWidth, clientHeight } = contentRef.current!;
    imageEditor.current = new ImageEditor({
      canvasElement: canvasRef.current!,
      maxWidth: clientWidth,
      maxHeight: clientHeight,
    });

    imageEditor.current.setUrl(demo);
  }, []);
  return (
    <div className='container'>
      <div className='header'>
        <button onClick={crop}>crop</button>
        <button onClick={addFilter}>filter</button>
        <button onClick={rotate}>rotate</button>
        <button onClick={flipX}>flipX</button>
        <button onClick={flipY}>flipY</button>
        <button onClick={mosaic}>mosaic</button>
        &nbsp;
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
      </div>
      <div className='body'>
        <div className='content' ref={contentRef}>
          <div ref={transformRef}>
            <canvas className='canvas' ref={canvasRef} />
          </div>
          {dimension && <Cropper dimension={dimension} onMove={move} />}
        </div>
      </div>

    </div>
  );
}

export default App;
