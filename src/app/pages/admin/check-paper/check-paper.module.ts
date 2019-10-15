import { NgModule } from '@angular/core';

import { CheckPaperComponent } from './check-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule],
  declarations: [CheckPaperComponent],
  exports: [CheckPaperComponent]
})
export class CheckPaperModule {
  constructor(){
    
  }
 }
