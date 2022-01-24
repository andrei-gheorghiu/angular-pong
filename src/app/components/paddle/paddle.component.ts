import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from "rxjs";
import { GameService } from "@/services/game/game.service";
import { safeUnsubscribe } from "@/utils/helper";

@Component({
  selector: 'pong-paddle',
  template: ''
})
export class PaddleComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _style: Record<string, string> = {}

  @HostBinding('style') get style() {
    return this._style
  }

  constructor(private game: GameService) {}

  ngOnInit() {
    this._subs.push(
      combineLatest([
        this.game.layout.MousePosition$,
        this.game.ball.radius$
      ]).subscribe(([{x}, r]) => {
        this._style = {
          left: `${x}px`,
          bottom: `${r / 2}px`,
          border: `${r / 2}px solid white`,
          backgroundColor: 'white',
          width: `${this.game.paddle.width}px`,
          borderRadius: `${r}px`
        }
      }),
    )
  }

  ngOnDestroy() {
    safeUnsubscribe(this._subs);
  }
}
