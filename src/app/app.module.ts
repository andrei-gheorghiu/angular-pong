import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from '@/components/board/board.component';
import { PaddleComponent } from '@/components/paddle/paddle.component';
import { BallComponent } from '@/components/ball/ball.component';
import { OverlayComponent } from './components/overlay/overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PaddleComponent,
    BallComponent,
    OverlayComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
