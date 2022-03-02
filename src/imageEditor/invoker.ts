import { Command, CommandType, getCommandConfigByType } from "./command";
import { Graphics } from "./graphics";

export class Invoker {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private isLocked = false; // TODO

  execute(graphics: Graphics, name: CommandType, args: any[]) {
    const cmd = new Command(
      getCommandConfigByType(name),
      graphics,
      args,
    );

    this.invokeExecution(cmd);
    this.clearRedoStack();
  }

  undo() {
    const cmd = this.undoStack.pop();
    if (cmd) {
      this.nvokeUndo(cmd);
    }
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (cmd) {
      this.invokeExecution(cmd);
    }
  }

  private invokeExecution(cmd: Command) {
    cmd.execute();
    this.undoStack.push(cmd);
  }

  private nvokeUndo(cmd: Command) {
    cmd.undo();
    this.redoStack.push(cmd);
  }

  private clearRedoStack() {
    this.redoStack = [];
  }
}