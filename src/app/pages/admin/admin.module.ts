import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { CheckStudentModule } from './check-student/check-student.module';

import {CheckQuestionModule} from './check-question/check-question.module';
import { GeneratePaperModule } from './generate-paper/generate-paper.module';

@NgModule({
  imports: [AdminRoutingModule,NgZorroAntdModule,CheckStudentModule,CheckQuestionModule,GeneratePaperModule],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminMoudle {
  constructor(){
    
  }
 }
