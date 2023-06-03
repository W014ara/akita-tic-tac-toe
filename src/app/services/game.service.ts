import {Injectable} from "@angular/core";
import {GameStore} from "../store/game.store";
import {IFiledCellModel} from "../field/field.model";

@Injectable()
export class GameService {
  constructor(private gameStore: GameStore) {
  }

  public switchTurn(): void {
    this.gameStore.update(state => {
      const nextTurn = state.currentPlayer === 0 ? 1 : 0;
      return {
        ...state,
        currentPlayer: nextTurn
      }
    })
  }

  public addValueToPlayer(player: number, cellIndex: number, matrix: Array<IFiledCellModel[]>): void {
    player = player === 0 ? 1 : 0;

    this.gameStore.update(state => {
      const updatedFrameStatus = JSON.parse(JSON.stringify(state.frameStatus));
      if (!updatedFrameStatus[player]) {
        updatedFrameStatus[player] = [];
      }

      updatedFrameStatus[player].push(cellIndex);

      if (this.isWin(matrix, updatedFrameStatus[player])) {
        return {...state, winner: player, frameStatus: updatedFrameStatus};
      }

      if (this.isDraw(matrix)) {
        return {
          ...state,
          isDraw: true
        }
      }

      return {...state, frameStatus: updatedFrameStatus};
    });
  }

  public restartGame() {
    this.gameStore.update({
      currentPlayer: 0,
      frameStatus: {},
      isDraw: false,
      isGameRestarted: true,
      winner: -1
    })

    this.gameStore.update({isGameRestarted: false})
  }

  private isDraw(matrix: Array<IFiledCellModel[]>): boolean {
    const isEmptyCellExists = matrix.some(row => row.some(cell => cell.isEmpty));
    return !isEmptyCellExists;
  }

  private isWin(matrix: Array<IFiledCellModel[]>, indexes: number[]): boolean {
    const raws = matrix.length;
    const columns = matrix[0].length;

    // check raws
    for (let rawIndex = 0; rawIndex < raws; ++rawIndex) {
      let isRowFilled = true;
      for (let columnIndex = 0; columnIndex < columns; ++columnIndex) {
        if (!indexes.includes(matrix[rawIndex][columnIndex].index)) {
          isRowFilled = false;
          break;
        }
      }
      if (isRowFilled) {
        return true;
      }
    }

    // check columns
    for (let columnIndex = 0; columnIndex < columns; ++columnIndex) {
      let isColumnFilled = true;
      for (let rawIndex = 0; rawIndex < raws; ++rawIndex) {
        if (!indexes.includes(matrix[rawIndex][columnIndex].index)) {
          isColumnFilled = false;
          break;
        }
      }
      if (isColumnFilled) {
        return true;
      }
    }

    // check main diagonal
    let isMainDiagonalFilled = true;
    for (let rawIndex = 0; rawIndex < raws; ++rawIndex) {
      if (!indexes.includes(matrix[rawIndex][rawIndex].index)) {
        isMainDiagonalFilled = false;
        break;
      }
    }
    if (isMainDiagonalFilled) {
      return true;
    }

    // check reverse diagonal
    let isReverseDiagonalFilled = true;
    for (let rawIndex = 0; rawIndex < raws; ++rawIndex) {
      const columnIndex = columns - 1 - rawIndex;
      if (!indexes.includes(matrix[rawIndex][columnIndex].index)) {
        isReverseDiagonalFilled = false;
        break;
      }
    }
    return isReverseDiagonalFilled;
  }
}
