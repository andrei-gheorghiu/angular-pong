import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from "rxjs";
import { randomBetween, safeUnsubscribe } from "@/utils/helper";
import { GameService } from "@/services/game/game.service";
import { pick } from "lodash-es";
import { IMousePosition } from "@/services/layout/layout.service";

@Component({
  selector: 'pong-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit, OnDestroy {
  @HostBinding('style') get cursor() {
    return this._cursor
  }
  @HostBinding('class') get gameStatus() {
    return {
      'game-over': this.game.isOver,
      'is-paused': this.game.isPaused
    }
  }

  _subs: Subscription[] = [];
  _cursor: Record<string, string> = {};
  constructor(
    public game: GameService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this._subs.push(
      this.game.layout.MousePosition$.subscribe(
        (e: IMousePosition) => this._cursor = {
          '--x': `${e.x}px`,
          '--y': `${e.y}px`
        }
      ),
      this.game.isPaused$
        .subscribe(
          isPaused => !isPaused && requestAnimationFrame(() => this.move())
        ),
      fromEvent(document, 'click')
        .subscribe(() => {
          if (this.game.isOver) {
            this.startGame()
          } else {
            this.game.toggle();
          }
        })
    );
    this.startGame();
  }

  startGame() {
    this.game.start({
        width: +(this.elRef.nativeElement?.clientWidth || 0),
        height: +(this.elRef.nativeElement?.clientHeight || 0)
      }, {
        speed: 7,
        radius: 7,
        y: +(this.elRef.nativeElement?.clientHeight || 0) / 5,
        angle: randomBetween(-40, -140)
      }
    );
  }

  ngOnDestroy() {
    safeUnsubscribe(this._subs);
  }

  get gameData() {
    return {
      ...pick(this.game.ball, ['speed']),
      ...pick(this.game, ['score', 'highScore'])
    }
  }

  logger(obj: any) {
    return JSON.stringify(obj, null, 2);
  }

  move() {
    if (!(this.game.isPaused)) {
      this.game.ball.move();
      requestAnimationFrame(() => this.move());
    }
  }
}
