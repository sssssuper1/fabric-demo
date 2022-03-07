import { CommandConfig } from ".";

export const flipCommand: CommandConfig = {
  name: 'flip',
  execute({ graphics, args: [type] }) {
    const flip = graphics.componentsMap['FLIP'];
    flip.flip(type);
  },
  undo({ graphics, args: [type] }) {
    const flip = graphics.componentsMap['FLIP'];
    flip.flip(type);
  },
}
