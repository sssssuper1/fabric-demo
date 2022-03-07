import React, { useEffect, useRef, useState } from 'react';
import ImageEditor from './imageEditor/imageEditor';
import Cropper, { CropperProps } from './Cropper';
import './App.css';

const demo = 'https://s.newscdn.cn/file/2022/02/17ecd7bb-6475-4dad-8662-af0f935cb60a.jpeg';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imageEditor = useRef<ImageEditor | null>(null);

  const [dimension, setDimension] = useState<CropperProps>();

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

  // const initCropper = () => {
  //   const cropper = new Cropper(imgRef.current!, {
  //     viewMode: 1,
  //     dragMode: 'move',
  //     movable: true,
  //     cropBoxMovable: false,
  //     zoomOnWheel: false,
  //     guides: false,
  //     rotatable: false,
  //     responsive: false,
  //     restore: false,
  //     center: false,
  //     background: false,
  //     toggleDragModeOnDblclick: false,
  //     autoCropArea: 1,
  //     crop(event) {
  //       console.log(event.detail.x);
  //       console.log(event.detail.y);
  //       console.log(event.detail.width);
  //       console.log(event.detail.height);
  //       console.log(event.detail.rotate);
  //       console.log(event.detail.scaleX);
  //       console.log(event.detail.scaleY);
  //     },
  //   });
  // };

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
          <canvas className='canvas' ref={canvasRef} />
          <Cropper {...dimension} />
          {/* <img className='canvas' ref={imgRef} src={demo} /> */}
        </div>
      </div>

    </div>
  );
}

export default App;
