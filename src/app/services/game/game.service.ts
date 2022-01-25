import { Injectable } from '@angular/core';
import { PaddleService, PaddleState } from "@/services/paddle/paddle.service";
import { BallService, BallState } from "@/services/ball/ball.service";
import { LayoutService } from "@/services/layout/layout.service";
import { BehaviorSubject } from "rxjs";
import { reactive } from "@/utils/helper";

interface GameState {
  width: number;
  height: number;
  score: number;
  highScore: number;
  isOver: boolean;
  isPaused: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService implements GameState {
  private readonly IsOver = new BehaviorSubject<boolean>(false);
  private readonly IsPaused = new BehaviorSubject<boolean>(true);

  readonly isPaused$ = reactive(this.IsPaused);

  width = 0;
  height = 0;
  score = 0;
  highScore = 0;

  get isOver(): boolean {
    return this.IsOver.getValue();
  }

  set isOver(val) {
    this.IsOver.next(val);
  }

  get isPaused(): boolean {
    return this.IsPaused.getValue() && !this.isOver;
  }

  set isPaused(val) {
    this.IsPaused.next(val);
  }

  ball: BallService;
  paddle: PaddleService;

  constructor(public layout: LayoutService) {
    this.ball = new BallService(this);
    this.paddle = new PaddleService(this);
  }

  start(data: Partial<GameState>, ball: Partial<BallState> = {}, paddle: Partial<PaddleState> = {}) {
    this.setHighScore();
    Object.assign(this, {
      ...data,
      isPaused: false,
      isOver: false
    });
    this.paddle.set({
      width: 105,
      ...paddle
    });
    this.ball.set({
      x: this.width / 2,
      y: 0,
      xs: 1,
      ys: 1,
      ...ball
    });
  }

  setHighScore() {
    this.highScore = Math.max(this.highScore, this.score);
    this.score = 0;
  }

  end() {
    this.isOver = true;
    this.setHighScore();
  }

  toggle() {
    this.isPaused = !this.isPaused;
  }
}
