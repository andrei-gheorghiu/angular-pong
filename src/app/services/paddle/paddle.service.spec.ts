import { TestBed } from '@angular/core/testing';

import { PaddleService } from './paddle.service';
import { GameService } from "@/services/game/game.service";
import { LayoutService } from "@/services/layout/layout.service";

describe('PaddleService', () => {
  let service: PaddleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, LayoutService]
    });
  });

  it('should be created', () => {
    expect(service).toBeFalsy();
  });
});
