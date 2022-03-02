import { Graphics } from "../graphics";
import { applyFilterCommand } from './applyFilter';

export type CommandType = 'applyFilter';

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
};

export const getCommandConfigByType = (type: CommandType) => CommandConfigMap[type];
