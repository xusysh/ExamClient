import { NgModule } from '@angular/core';

import { CheckQuestionComponent } from './check-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule],
  declarations: [CheckQuestionComponent],
  exports: [CheckQuestionComponent]
})
export class CheckQuestionModule {
  constructor(){
    
  }
 }
