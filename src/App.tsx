import React, { useRef } from 'react';
import ImageEditor, { ImageEditorRef } from './main';
import './App.css';

const demo = 'https://s.newscdn.cn/file/2022/02/17ecd7bb-6475-4dad-8662-af0f935cb60a.jpeg';

function App() {
  const imageEditor = useRef<ImageEditorRef>(null);

  const addFilter = () => {
    imageEditor.current?.editor.setFilter('Sharpen');
  };

  const rotate = () => {
    imageEditor.current?.editor.rotate(270);
  };

  const flipX = () => {
    imageEditor.current?.editor.flip('x');
  };

  const flipY = () => {
    imageEditor.current?.editor.flip('y');
  };

  const mosaic = () => {
    imageEditor.current?.editor.addMosaic();
  };

  const undo = () => {
    imageEditor.current?.editor.undo();
  };

  const redo = () => {
    imageEditor.current?.editor.redo();
  };

  const crop = () => {
    imageEditor.current?.crop();
  };

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
        <ImageEditor ref={imageEditor} url={demo} />
      </div>
    </div>
  );
}

export default App;
