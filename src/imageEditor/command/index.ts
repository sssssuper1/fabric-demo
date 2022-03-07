import { Graphics } from "../graphics";
import { applyFilterCommand } from './applyFilter';
import { flipCommand } from "./flip";
import { rotateCommand } from "./rotate";

export type CommandType = 'applyFilter' | 'flip' | 'rotate';

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
};

export const getCommandConfigByType = (type: CommandType) => CommandConfigMap[type];
