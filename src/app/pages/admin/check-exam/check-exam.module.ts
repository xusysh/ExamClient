import { NgModule } from '@angular/core';

import { CheckExamComponent } from './check-exam.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [CheckExamComponent],
  exports: [CheckExamComponent]
})
export class CheckExamModule {
  constructor(){
    
  }
 }
