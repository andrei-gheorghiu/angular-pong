import { BehaviorSubject } from "rxjs";

import { GameService } from "@/services/game/game.service";
import { observe } from "@/utils/helper";
import { Injectable } from "@angular/core";

export interface BallState {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
  xs: number;
  ys: number;
}

@Injectable({
  providedIn: 'root'
})
export class BallService implements BallState {
  private readonly X = new BehaviorSubject<number>(0);
  private readonly Y = new BehaviorSubject<number>(0);
  private readonly Radius = new BehaviorSubject<number>(12);

  xs = 1;
  ys = 1;
  speed = 1;
  angle = 45;

  x$ = observe(this.X);
  y$ = observe(this.Y);
  radius$ = observe(this.Radius);

  get x(): number {
    return this.X.getValue();
  }

  set x(val) {
    this.X.next(val);
  }

  get y(): number {
    return this.Y.getValue();
  }

  set y(val) {
    this.Y.next(val);
  }

  get radius(): number {
    return this.Radius.getValue();
  }

  set radius(val) {
    this.Radius.next(val);
  }

  constructor(
    private game: GameService
  ) { }

  set(data: Partial<BallState>) {
    Object.assign(this, data);
  }

  get dx(): number {
    return this.speed * this.xs * Math.cos(this.angle * Math.PI / 180)
  }
  get dy(): number {
    return this.speed * this.ys * Math.sin(this.angle * Math.PI / 180)
  }

  assign(state: Partial<BallState>) {
    Object.assign(this, state);
  }

  clamp(horizontal = true) {
    this[horizontal ? 'x' : 'y'] = Math.max(
      this.radius,
      Math.min(
        this.game[horizontal ? 'width' : 'height'] - this.radius,
        this[horizontal? 'x' : 'y']
      )
    )
  }

  move() {
    if (!this.game.isPaused) {
      this.x += this.dx;
      this.y += this.dy;
      this.update();
    }
  }

  update() {
    if (this.x + this.radius > this.game.width || this.x - this.radius < 0) {
      this.clamp(true);
      this.speedUp(2);
      this.game.score += 10;
      this.xs *= -1;
    }
    if ((this.y > this.game.height - this.radius * 3) && !this.game.isOver) {
      const check = this.game.paddle.check(this.x);
      if (check === null && this.y - this.dy > this.game.height) {
        this.game.end();
      } else if (typeof check === 'number') {
        this.angle = 175 + 190 * check;
        this.speedUp();
        this.game.score += 20;
        this.xs = 1;
        this.ys = 1;
      }
    }
    if (this.y > this.game.height) {
      this.gameOver();
    }
    if (this.y - this.radius < 0) {
      this.clamp(false);
      this.game.score += 100;
      this.ys *= -1;
    }
  }

  speedUp(increase = 1) {
    this.speed = (increase + this.speed * 10) / 10;
  }

  gameOver() {
    this.xs = 0;
    this.ys = 0;
    this.game.end();
  }

}
