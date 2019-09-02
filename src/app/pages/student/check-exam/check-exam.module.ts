import { NgModule } from '@angular/core';

import { CheckExamRoutingModule } from './check-exam-routing.module';

import { CheckExamComponent } from './check-exam.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [CheckExamRoutingModule,NgZorroAntdModule,CommonModule],
  declarations: [CheckExamComponent],
  exports: [CheckExamComponent]
})
export class CheckExamModule {


  constructor(){
    
  }

 }

