import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {CommonModule} from '@angular/common'

@NgModule({
  imports: [LoginRoutingModule,NgZorroAntdModule,FormsModule,ReactiveFormsModule,CommonModule],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
  constructor(){
    
  }
 }
