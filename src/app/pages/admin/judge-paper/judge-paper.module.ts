import { NgModule } from '@angular/core';

import { JudgePaperComponent } from './judge-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule],
  declarations: [JudgePaperComponent],
  exports: [JudgePaperComponent]
})
export class JudgePaperModule {
  constructor(){
    
  }
 }
