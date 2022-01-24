import { TestBed } from '@angular/core/testing';

import { BallService } from './ball.service';
import { GameService } from "@/services/game/game.service";
import { LayoutService } from "@/services/layout/layout.service";

describe('BallService', () => {
  let service: BallService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, BallService, LayoutService]
    });
    service = TestBed.inject(BallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
