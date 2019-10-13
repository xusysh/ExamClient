import { NgModule } from '@angular/core';

import { TestComponent } from './test.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {CommonModule} from '@angular/common';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';


@NgModule({
  imports: [NgZorroAntdModule,FormsModule,ReactiveFormsModule,CommonModule,MonacoEditorModule],
  declarations: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {
  constructor(){
    
  }
 }
