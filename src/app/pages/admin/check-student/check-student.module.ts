import { NgModule } from '@angular/core';

import { CheckStudentComponent } from './check-student.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [NgZorroAntdModule,CommonModule],
  declarations: [CheckStudentComponent],
  exports: [CheckStudentComponent]
})
export class CheckStudentModule {


  constructor(){
    
  }

 }

