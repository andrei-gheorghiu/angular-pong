import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from "rxjs";
import { safeUnsubscribe } from "../utils/helper";
import { IMousePosition, LayoutService } from "./services/layout/layout.service";
import { pick } from "lodash-es";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-test';
  subs: Subscription[] = [];

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.subs.push(
      fromEvent(document, 'mousemove')
        .subscribe(
          e => this.layoutService.mousePosition = pick(e, ['x', 'y']) as IMousePosition)
    );
  }

  ngOnDestroy() {
    safeUnsubscribe(this.subs);
  }
}
