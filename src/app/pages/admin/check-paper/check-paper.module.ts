import { NgModule } from '@angular/core';

import { CheckPaperComponent } from './check-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [CheckPaperComponent],
  exports: [CheckPaperComponent]
})
export class CheckPaperModule {
  constructor(){
    
  }
 }
