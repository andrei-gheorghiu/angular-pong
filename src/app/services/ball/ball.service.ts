import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { GameService } from "../game/game.service";
import { observe } from "../../../utils/helper";

export interface BallState {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
  xS: number;
  yS: number;
}

@Injectable({
  providedIn: 'root'
})
export class BallService implements BallState {
  private readonly X = new BehaviorSubject<number>(0);
  private readonly Y = new BehaviorSubject<number>(0);
  private readonly XS = new BehaviorSubject<number>(1);
  private readonly YS = new BehaviorSubject<number>(1);
  private readonly Speed = new BehaviorSubject<number>(1);
  private readonly Angle = new BehaviorSubject<number>(45);
  private readonly Radius = new BehaviorSubject<number>(12);

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

  get xS(): number {
    return this.XS.getValue();
  }

  set xS(val) {
    this.XS.next(val);
  }

  get yS(): number {
    return this.YS.getValue();
  }

  set yS(val) {
    this.YS.next(val);
  }

  get speed(): number {
    return this.Speed.getValue();
  }

  set speed(val) {
    this.Speed.next(val);
  }

  get angle(): number {
    return this.Angle.getValue();
  }

  set angle(val) {
    this.Angle.next(val);
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
    return this.speed * this.xS * Math.cos(this.angle * Math.PI / 180)
  }
  get dy(): number {
    return this.speed * this.yS * Math.sin(this.angle * Math.PI / 180)
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
      this.xS *= -1;
    }
    if ((this.y > this.game.height - this.radius * 3) && !this.game.isOver) {
      const check = this.game.paddle.check(this.x);
      if (check === null && this.y - this.dy > this.game.height) {
        this.game.end();
      } else if (typeof check === 'number') {
        this.angle = 175 + 190 * check;
        this.speedUp();
        this.game.score += 20;
        this.xS = 1;
        this.yS = 1;
      }
    }
    if (this.y > this.game.height) {
      this.gameOver();
    }
    if (this.y - this.radius < 0) {
      this.clamp(false);
      this.game.score += 100;
      this.yS *= -1;
    }
  }

  speedUp(increase = 1) {
    this.speed = (increase + this.speed * 10) / 10;
  }

  gameOver() {
    this.xS = 0;
    this.yS = 0;
    this.game.end();
  }

}
