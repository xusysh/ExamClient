import { NgModule } from '@angular/core';

import { ExaminationComponent } from './examination.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [ExaminationComponent],
  exports: [ExaminationComponent]
})
export class ExaminationModule {


  constructor(){
    
  }

 }

