import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from "@angular/core";

export interface GameState {
  currentPlayer: number;
  winner: number;
  frameStatus: FrameStatus;
  isDraw: boolean,
  isGameRestarted: boolean
}

export interface FrameStatus {
  [key: string]: number[];
}

export function createInitialState(): GameState {
  return {
    currentPlayer: 0,
    frameStatus: {},
    winner: -1,
    isDraw: false,
    isGameRestarted: false
  };
}

@Injectable({providedIn: "root"})
@StoreConfig({name: 'game'})
export class GameStore extends Store<GameState> {
  constructor() {
    super(createInitialState());
  }
}
