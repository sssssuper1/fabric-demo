import React, { useEffect, useRef } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import './App.css';

const demo = 'https://s.newscdn.cn/file/2022/02/17ecd7bb-6475-4dad-8662-af0f935cb60a.jpeg';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageEditor = useRef<ImageEditor | null>(null);

  const addFilter = () => {
    imageEditor.current?.setFilter('Brightness', { brightness: 0.1 });
  };

  const rotate = () => {
    imageEditor.current?.rotate(90);
  };

  const flip = () => {
    imageEditor.current?.flip();
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
        <button onClick={addFilter}>filter</button>
        <button onClick={rotate}>rotate</button>
        <button onClick={flip}>flip</button>
        <button onClick={mosaic}>mosaic</button>
        &nbsp;
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
      </div>
      <div className='content' ref={contentRef}>
        <canvas className='canvas' ref={canvasRef} />
      </div>
    </div>
  );
}

export default App;
