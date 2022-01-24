import { GameService } from "@/services/game/game.service";
import { Injectable } from "@angular/core";

export interface PaddleState {
  width: number;
  height: number;
  x: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaddleService implements PaddleState {
  width = 100;
  height = 10;

  get x(): number {
    return this.game.layout.mousePosition.x;
  }

  get left(): number {
    return this.x - this.width/2
  }

  get right(): number {
    return this.x + this.width/2
  }

  constructor(
    private game: GameService
  ) {}

  set(data: Partial<PaddleState>) {
    Object.assign(this, data);
  }

  check(x: number): number | null {
    return this.left <= x && this.right >= x
      ? (x - this.left) / (this.width + this.game.ball.radius * 2)
      : null;
  }
}
