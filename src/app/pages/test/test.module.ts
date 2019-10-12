import { NgModule } from '@angular/core';

import { TestComponent } from './test.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {CommonModule} from '@angular/common'

@NgModule({
  imports: [NgZorroAntdModule,FormsModule,ReactiveFormsModule,CommonModule],
  declarations: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {
  constructor(){
    
  }
 }
