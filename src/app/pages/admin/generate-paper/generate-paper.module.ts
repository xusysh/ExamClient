import { NgModule } from '@angular/core';

import { GeneratePaperComponent } from './generate-paper.component';

import { NgZorroAntdModule} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCodeBoxModule } from 'src/app/tools/nz-codebox/nz-codebox.module';


@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule,NzCodeBoxModule],
  declarations: [GeneratePaperComponent],
  exports: [GeneratePaperComponent]
})
export class GeneratePaperModule {
  constructor(){
    
  }
 }
