import {Query} from '@datorama/akita';
import {GameState, GameStore} from './game.store';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class GameQuery extends Query<GameState> {
  constructor(private gameStore: GameStore) {
    super(gameStore);
  }

  public getCurrentPlayer(): Observable<number> {
    return this.select((state: GameState) => {
      return state.currentPlayer;
    })
  }

  public getDrawStatus(): Observable<boolean> {
    return this.select((state: GameState) => {
      return state.isDraw
    })
  }

  public getGameRestartStatus(): Observable<boolean> {
    return this.select((state: GameState) => {
      return state.isGameRestarted
    })
  }

  public getWinner(): Observable<number> {
    return this.select((state: GameState) => {
      return state.winner
    })
  }
}
