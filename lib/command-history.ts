import { Node, Edge } from 'reactflow';
import { MilestoneData } from '@/components/milestone-node';

export type Command = {
  type: 'add-node' | 'delete-node' | 'update-node' | 'add-edge' | 'delete-edge';
  timestamp: number;
  execute: (state: CommandState) => CommandState;
  undo: (state: CommandState) => CommandState;
};

export type CommandState = {
  nodes: Node<MilestoneData>[];
  edges: Edge[];
};

export class CommandHistory {
  private history: Command[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;

  execute(command: Command, state: CommandState): CommandState {
    // Remove any commands after current index (for branching)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Execute the command
    const newState = command.execute(state);

    // Add to history
    this.history.push(command);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }

    return newState;
  }

  undo(state: CommandState): { newState: CommandState; canUndo: boolean } {
    if (this.currentIndex < 0) {
      return { newState: state, canUndo: false };
    }

    const command = this.history[this.currentIndex];
    this.currentIndex--;

    return {
      newState: command.undo(state),
      canUndo: this.currentIndex >= 0,
    };
  }

  redo(state: CommandState): { newState: CommandState; canRedo: boolean } {
    if (this.currentIndex >= this.history.length - 1) {
      return { newState: state, canRedo: false };
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];

    return {
      newState: command.execute(state),
      canRedo: this.currentIndex < this.history.length - 1,
    };
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}
