import React, { memo } from 'react';
import './index.css';

export interface CropperProps {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

const borderWidth = 2;
const halfBorderWidht = 1;

const getOffset = (v: number) => v - borderWidth / 2;

const Cropper: React.FC<CropperProps> = ({
  width = 0,
  height = 0,
  top = 0,
  left = 0,
}) => {
  return (
    <div className='cropper-box' style={{
      width: getOffset(width),
      height: getOffset(height),
      top: getOffset(top),
      left: getOffset(left),
      borderWidth,
    }}>
      <i className='cropper-grip cropper-grip-s cropper-grip-h' />
      <i className='cropper-grip cropper-grip-sw cropper-grip-h cropper-grip-v' />
      <i className='cropper-grip cropper-grip-w cropper-grip-v' />
      <i className='cropper-grip cropper-grip-nw cropper-grip-h cropper-grip-v' />
      <i className='cropper-grip cropper-grip-n cropper-grip-h' />
      <i className='cropper-grip cropper-grip-ne cropper-grip-h cropper-grip-v' />
      <i className='cropper-grip cropper-grip-e cropper-grip-v' />
      <i className='cropper-grip cropper-grip-se cropper-grip-h cropper-grip-v' />
    </div>
  );
};

export default memo(Cropper);
