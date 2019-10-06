import { NgModule } from '@angular/core';

import { CheckQuestionComponent } from './check-question.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [CheckQuestionComponent],
  exports: [CheckQuestionComponent]
})
export class CheckQuestionModule {
  constructor(){
    
  }
 }
