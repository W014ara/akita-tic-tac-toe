import {Component, Input, OnInit} from '@angular/core';
import {GameQuery} from "../store/game.query";
import {GameService} from "../services/game.service";
import {IFiledCellModel} from "./field.model";
import {filter, skip} from "rxjs";

@Component({
  selector: 'GameField',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {
  @Input()
  public size: number = 3;
  public _field: Array<IFiledCellModel[]>;

  private currentPlayer: number;

  constructor(private gameQuery: GameQuery, private gameService: GameService) {
  }

  ngOnInit() {
    this.gameQuery.getCurrentPlayer().subscribe((value: number) => {
      this.currentPlayer = value;
    })

    this.gameQuery.getGameRestartStatus().pipe(filter(restartStatus => restartStatus)).subscribe((value: boolean) => {
      this._field = this.convertSingeArrayToMatrix();
    })

    this.gameQuery.getWinner().pipe(skip(1), filter((value) => value >= 0)).subscribe(value => {
      this.disableAllFields();
    })

    this._field = this.convertSingeArrayToMatrix();
  }

  public _onCellClick(cell: IFiledCellModel) {
    if (cell.isEmpty) {
      this.gameService.switchTurn();

      this._field = this._field.map(item => {
        return item.map((value: IFiledCellModel) => {
          if (value.index === cell.index) {
            return {
              ...value,
              ringed: this.currentPlayer !== 0,
              crossed: this.currentPlayer === 0,
              isEmpty: false
            }
          }
          return value;
        })
      })

      this.gameService.addValueToPlayer(this.currentPlayer, cell.index, this._field);
    }
  }

  public convertSingeArrayToMatrix(): Array<IFiledCellModel[]> {
    let result = []
    let array = Array.from(Array(this.size * this.size).keys()).map(value => {
      return {
        index: value,
        isEmpty: true,
        isFirstPlayer: this.currentPlayer === 0,
        allDisabled: false,
        crossed: false,
        ringed: false
      }
    })

    for (let i = 0; i < array.length; i += this.size) {
      result.push(array.slice(i, i + this.size)); // Разбиваем массив на подмассивы
    }

    return result;
  }

  public disableAllFields(): void {
    this._field = this._field.map(arr => {
      return arr.map((value: IFiledCellModel) => {
        return {...value, isEmpty: false, allDisabled: true}
      })
    })
  }
}
