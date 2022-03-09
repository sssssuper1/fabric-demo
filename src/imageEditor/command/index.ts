import { Graphics } from "../graphics";
import { applyFilterCommand } from './applyFilter';
import { flipCommand } from "./flip";
import { rotateCommand } from "./rotate";
import { cropCommand } from './crop';

export type CommandType = 'applyFilter' | 'flip' | 'rotate' | 'crop';

export interface CommandConfig {
  name: CommandType;
  execute(command: Command): void;
  undo(command: Command): void;
}

export class Command {
  graphics: Graphics;
  undoData: Record<string, any> = { };
  args: any[];
  config: CommandConfig;
  constructor(config: CommandConfig, graphics: Graphics, args: any) {
    this.graphics = graphics;
    this.args = args;

    this.config = config;
  }

  execute() {
    this.config.execute(this);
  }
  
  undo() {
    this.config.undo(this);
  }
}

const CommandConfigMap: Record<CommandType, CommandConfig> = {
  applyFilter: applyFilterCommand,
  flip: flipCommand,
  rotate: rotateCommand,
  crop: cropCommand,
};

export const getCommandConfigByType = (type: CommandType) => CommandConfigMap[type];
