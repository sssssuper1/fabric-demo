export const calculateCanvasSizeByImage = (width: number, height: number, maxWidth?: number, maxHeight?: number) => {
  if (!maxWidth || !maxHeight) return { width, height, scale: 1 };

  const scale = Math.min(maxWidth / width, maxHeight / height);

  return {
    width: Math.floor(width * scale),
    height: Math.floor(height * scale),
    scale,
  };
}
