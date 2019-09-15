import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { CheckStudentModule } from './check-student/check-student.module';


@NgModule({
  imports: [AdminRoutingModule,NgZorroAntdModule,CheckStudentModule],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminMoudle {
  constructor(){
    
  }
 }
