import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { combineLatest, distinctUntilChanged, fromEvent, Subscription } from "rxjs";
import { randomBetween, safeUnsubscribe } from "../../../utils/helper";
import { GameService } from "../../services/game/game.service";
import { pick } from "lodash-es";
import { IMousePosition } from "../../services/layout/layout.service";

@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PongGameComponent implements OnInit, OnDestroy {
  @HostBinding('style.--x') get x() { return this.cursor.x + 'px' }
  @HostBinding('style.--y') get y() { return this.cursor.y + 'px' }

  subs: Subscription[] = [];
  cursor: Partial<IMousePosition> = {};
  paddleStyle = {};
  ballStyle = {};
  constructor(
    private game: GameService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.game.layout.MousePosition$.subscribe(
        e => this.cursor = e
      ),
      combineLatest([
        this.game.layout.MousePosition$,
        this.game.ball.radius$
      ]).subscribe(([{x}, r]) => {
        this.paddleStyle = {
          left: `${x}px`,
          bottom: `${r / 2}px`,
          border: `${r / 2}px solid white`,
          backgroundColor: 'white',
          width: `${this.game.paddle.width}px`,
          borderRadius: `${r}px`
        }
      }),
      combineLatest([
        this.game.ball.x$,
        this.game.ball.y$,
        this.game.ball.radius$
      ]).subscribe(([x, y, r]) => {
        this.ballStyle = {
          left: `${x}px`,
          top: `${y}px`,
          border: `${r}px solid white`
        }
      }),
      this.game.isPaused$
        .pipe(distinctUntilChanged())
        .subscribe(
          isPaused => !isPaused && requestAnimationFrame(() => this.move())
        ),
      fromEvent(document, 'click')
        .subscribe(() => {
          if (this.game.isOver) {
            this.start()
          } else {
            this.game.toggle();
          }
        })
    );
    this.start();
  }

  start() {
    this.game.start({
        width: +(this.elRef.nativeElement?.clientWidth || 0),
        height: +(this.elRef.nativeElement?.clientHeight || 0)
      }, {
        speed: 7,
        radius: 7,
        xS: 1,
        yS: 1,
        y: +(this.elRef.nativeElement?.clientHeight || 0) / 5,
        angle: randomBetween(-40, -140)
      }
    );
  }

  ngOnDestroy() {
    safeUnsubscribe(this.subs);
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
    console.log('here');
    if (!(this.game.isPaused)) {
      this.game.ball.move();
      requestAnimationFrame(() => this.move());
    }
  }
}
