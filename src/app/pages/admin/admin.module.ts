import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { CheckStudentModule } from './check-student/check-student.module';

import {CheckQuestionModule} from './check-question/check-question.module';
import { GeneratePaperModule } from './generate-paper/generate-paper.module';
import { JudgePaperModule } from './judge-paper/judge-paper.module';
import { CheckPaperModule } from './check-paper/check-paper.module';
import { CheckExamModule } from '../admin/check-exam/check-exam.module';
import { CheckExamPaperModule } from './check-exam-paper-detail/check-exam-paper.module';

@NgModule({
  imports: [AdminRoutingModule,NgZorroAntdModule,CheckStudentModule,CheckQuestionModule,GeneratePaperModule,
  CheckPaperModule,CheckExamModule,JudgePaperModule,CheckExamPaperModule],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminMoudle {
  constructor(){
    
  }
 }
