import { NgModule } from '@angular/core';

import { JudgePaperComponent } from './judge-paper.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [JudgePaperComponent],
  exports: [JudgePaperComponent]
})
export class JudgePaperModule {
  constructor() {

  }
}
