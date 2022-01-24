import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from '@/components/board/board.component';
import { PaddleComponent } from '@/components/paddle/paddle.component';
import { BallComponent } from '@/components/ball/ball.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PaddleComponent,
    BallComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
