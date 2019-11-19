import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { CheckExamComponent } from './check-exam/check-exam.component';
import { ExaminationComponent } from './examination/examination.component';
import { CheckExamPaperComponent } from './check-exam-paper-detail/check-exam-paper.component';

const routes: Routes = [
  {
    path: '', component: StudentComponent, children: [
      {
        path: '', redirectTo: 'check-exam', pathMatch: 'full'
      },
      {
        path: 'check-exam', component: CheckExamComponent
      },
      {
        path: 'examination', component: ExaminationComponent
      },
      {
        path: 'check-exam-paper', component: CheckExamPaperComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
