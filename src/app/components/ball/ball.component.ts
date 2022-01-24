import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from "rxjs";
import { GameService } from "@/services/game/game.service";
import { safeUnsubscribe } from "@/utils/helper";

@Component({
  selector: 'pong-ball',
  template: ''
})
export class BallComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _style: Record<string, string> = {};

  @HostBinding('style') get style() {
    return this._style
  }

  constructor(private game: GameService) { }

  ngOnInit(): void {
    this._subs.push(
      combineLatest([
        this.game.ball.x$,
        this.game.ball.y$,
        this.game.ball.radius$
      ]).subscribe(([x, y, r]) => {
        this._style = {
          left: `${x}px`,
          top: `${y}px`,
          border: `${r}px solid white`
        }
      }),
    )
  }

  ngOnDestroy() {
    safeUnsubscribe(this._subs);
  }

}
