import { CommandConfig } from ".";

export const applyFilterCommand: CommandConfig = {
  name: 'applyFilter',
  execute({ graphics, undoData, args: [type, options] }) {
    const filter = graphics.componentsMap['FILTER'];
    const currentOptions = filter.getOptions(type);
    if (currentOptions) {
      undoData.options = currentOptions;
    }
    filter.add(type, options);
  },
  undo({ graphics, undoData, args: [type] }) {
    const filter = graphics.componentsMap['FILTER'];
    if (undoData.options) {
      filter.add(type, undoData.options);
    } else {
      filter.remove(type);
    }
  },
}
