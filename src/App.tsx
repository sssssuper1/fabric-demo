import React, { useRef } from 'react';
import ImageEditor, { ImageEditorRef } from './main';
import './App.css';

const demo = 'https://s.newscdn.cn/file/2022/02/17ecd7bb-6475-4dad-8662-af0f935cb60a.jpeg';

function App() {
  const imageEditor = useRef<ImageEditorRef>(null);

  const addFilter = () => {
    imageEditor.current?.getEditor().setFilter('Sharpen');
  };

  const rotate = () => {
    imageEditor.current?.getEditor().rotate(20);
  };

  const flipX = () => {
    imageEditor.current?.getEditor().flip('x');
  };

  const flipY = () => {
    imageEditor.current?.getEditor().flip('y');
  };

  const mosaic = () => {
    imageEditor.current?.getEditor().addMosaic();
  };

  const undo = () => {
    imageEditor.current?.getEditor().undo();
  };

  const redo = () => {
    imageEditor.current?.getEditor().redo();
  };

  const crop = () => {
    imageEditor.current?.startCrop();
  };

  const applyCrop = () => {
    imageEditor.current?.applyCrop();
  };

  const test = () => {
    imageEditor.current?.getEditor().test();
  };

  return (
    <div className='container'>
      <div className='header'>
        <button onClick={test}>test</button>
        &nbsp;
        <button onClick={crop}>crop</button>
        <button onClick={applyCrop}>apply</button>
        &nbsp;
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
        <ImageEditor ref={imageEditor} url={demo} />
      </div>
    </div>
  );
}

export default App;
