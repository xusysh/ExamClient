import { NgModule } from '@angular/core';

import { ExaminationComponent } from './examination.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'

@NgModule({
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  declarations: [ExaminationComponent],
  exports: [ExaminationComponent]
})
export class ExaminationModule {


  constructor() {

  }

}

