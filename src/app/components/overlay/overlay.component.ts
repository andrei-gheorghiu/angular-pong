import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { GameService } from "@/services/game/game.service";

@Component({
  selector: 'pong-overlay',
  templateUrl: './overlay.component.html'
})
export class OverlayComponent {

  @Output() restartGame = new EventEmitter();
  @HostBinding('class') get _class() { return 'overlay' };
  constructor(public game: GameService) { }

  restart(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.restartGame.emit();
  }

}
