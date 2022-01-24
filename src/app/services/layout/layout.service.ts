import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

export interface IMousePosition {
  x: number;
  y: number;
}
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly MousePosition = new BehaviorSubject<IMousePosition>({x: 0, y: 0});

  readonly MousePosition$ = this.MousePosition.asObservable();

  get mousePosition(): IMousePosition {
    return this.MousePosition.getValue();
  }

  set mousePosition(val: IMousePosition) {
    this.MousePosition.next(val);
  }
}
