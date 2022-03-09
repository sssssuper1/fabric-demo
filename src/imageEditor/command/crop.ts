import { CommandConfig } from ".";

export const cropCommand: CommandConfig = {
  name: 'crop',
  execute({ graphics, undoData, args: [rect] }) {
    const cropper = graphics.componentsMap['CROPPER'];
    undoData.originalSize = cropper.getCurrentSize();
    cropper.crop(rect, false);
  },
  undo({ graphics, undoData }) {
    const cropper = graphics.componentsMap['CROPPER'];
    cropper.crop(undoData.originalSize, true);
  },
}
