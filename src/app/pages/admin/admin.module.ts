import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import {CheckGroupModule} from './check-group/check-group.module'


@NgModule({
  imports: [AdminRoutingModule,NgZorroAntdModule,CheckGroupModule],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminMoudle {
  constructor(){
    
  }
 }
