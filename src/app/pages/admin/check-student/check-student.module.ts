import { NgModule } from '@angular/core';
import { CheckStudentComponent } from './check-student.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [CheckStudentComponent],
  exports: [CheckStudentComponent]
})
export class CheckStudentModule {


  constructor(){
    
  }

 }

