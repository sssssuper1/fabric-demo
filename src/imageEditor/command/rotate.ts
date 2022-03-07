import { CommandConfig } from ".";

export const rotateCommand: CommandConfig = {
  name: 'rotate',
  execute({ graphics, args: [angle] }) {
    const rotation = graphics.componentsMap['ROTATION'];
    rotation.rotate(angle);
  },
  undo({ graphics, args: [angle] }) {
    const rotation = graphics.componentsMap['ROTATION'];
    rotation.rotate(-angle);
  },
}
