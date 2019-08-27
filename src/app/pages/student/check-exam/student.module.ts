import { NgModule } from '@angular/core';

import { StudentRoutingModule } from './student-routing.module';

import { StudentComponent } from './student.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  imports: [StudentRoutingModule,NgZorroAntdModule],
  declarations: [StudentComponent],
  exports: [StudentComponent]
})
export class StudentModule {
  constructor(){
    
  }
 }
