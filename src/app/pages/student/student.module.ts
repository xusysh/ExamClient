import { NgModule } from '@angular/core';

import { StudentRoutingModule } from './student-routing.module';

import { StudentComponent } from './student.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import {CheckExamModule} from './check-exam/check-exam.module'
import { ExaminationModule } from './examination/examination.module';
import { CheckExamPaperModule } from './check-exam-paper-detail/check-exam-paper.module';


@NgModule({
  imports: [StudentRoutingModule,NgZorroAntdModule,CheckExamModule,ExaminationModule,CheckExamPaperModule],
  declarations: [StudentComponent],
  exports: [StudentComponent]
})
export class StudentModule {
  constructor(){
    
  }
 }
