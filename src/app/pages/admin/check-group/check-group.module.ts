import { NgModule } from '@angular/core';

import { CheckGroupComponent } from './check-group.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [NgZorroAntdModule,CommonModule],
  declarations: [CheckGroupComponent],
  exports: [CheckGroupComponent]
})
export class CheckGroupModule {


  constructor(){
    
  }

 }

