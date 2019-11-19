import { NgModule } from '@angular/core';

import { CheckExamPaperComponent } from './check-exam-paper.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'

@NgModule({
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  declarations: [CheckExamPaperComponent],
  exports: [CheckExamPaperComponent]
})
export class CheckExamPaperModule {


  constructor() {

  }

}

