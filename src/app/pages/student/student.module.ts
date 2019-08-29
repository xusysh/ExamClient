import { NgModule } from '@angular/core';

import { StudentRoutingModule } from './student-routing.module';

import { StudentComponent } from './student.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import {CheckExamModule} from './check-exam/check-exam.module'


@NgModule({
  imports: [StudentRoutingModule,NgZorroAntdModule,CheckExamModule],
  declarations: [StudentComponent],
  exports: [StudentComponent]
})
export class StudentModule {
  constructor(){
    
  }
 }
