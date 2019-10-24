import { NgModule } from '@angular/core';

import { GeneratePaperComponent } from './generate-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop'


@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule,DragDropModule],
  declarations: [GeneratePaperComponent],
  exports: [GeneratePaperComponent]
})
export class GeneratePaperModule {
  constructor(){
    
  }
 }
