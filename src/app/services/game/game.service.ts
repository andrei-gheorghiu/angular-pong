import { Injectable } from '@angular/core';
import { PaddleService, PaddleState } from "../paddle/paddle.service";
import { BallService, BallState } from "../ball/ball.service";
import { LayoutService } from "../layout/layout.service";
import { BehaviorSubject } from "rxjs";

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
  private readonly IsPaused = new BehaviorSubject<boolean>(false);

  readonly isPaused$ = this.IsPaused.asObservable();

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
    return this.IsPaused.getValue() && !this.IsOver.getValue();
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
