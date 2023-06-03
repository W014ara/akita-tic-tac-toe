import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GameQuery} from "./store/game.query";
import {GameService} from "./services/game.service";
import {filter, skip} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public _currentPlayer: number;
  public congratulations: string;
  public drawText: string;

  constructor(private gameQuery: GameQuery, private gameService: GameService) {
  }

  ngOnInit() {
    this.gameQuery.getCurrentPlayer().subscribe((currentPlayer: number) => {
      this._currentPlayer = currentPlayer + 1;
    })

    this.gameQuery.getDrawStatus().pipe(filter(drawStatus => drawStatus)).subscribe((value: boolean) => {
      this.drawText = "Упс, ничья!";
    })

    this.gameQuery.getGameRestartStatus().pipe(filter(restartStatus => restartStatus)).subscribe((value: boolean) => {
      this.congratulations = '';
    })

    this.gameQuery.getWinner().pipe(skip(1), filter((value) => value >= 0)).subscribe((value: number) => {
      this.congratulations = `Игра окончена! Победил игрок №${value + 1} `;
    })
  }

  public restartGame() {
    this.congratulations = '';
    this.drawText = '';
    this.gameService.restartGame();
  }
}
