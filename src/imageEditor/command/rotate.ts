import { CommandConfig } from ".";

export const rotateCommand: CommandConfig = {
  name: 'rotate',
  execute({ graphics, args: [angle, save] }) {
    const rotation = graphics.componentsMap['ROTATION'];
    rotation.rotate(angle, save);
  },
  undo({ graphics, args: [angle, save] }) {
    const rotation = graphics.componentsMap['ROTATION'];
    rotation.rotate(-angle, save);
  },
}
