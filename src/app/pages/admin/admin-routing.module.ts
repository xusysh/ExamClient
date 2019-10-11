import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CheckStudentComponent } from './check-student/check-student.component';
import { CheckQuestionComponent } from './check-question/check-question.component';
import { GeneratePaperComponent } from './generate-paper/generate-paper.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: '', redirectTo: 'check-student', pathMatch: 'full'
      },
      {
        path: 'check-student', component: CheckStudentComponent
      },
      {
        path: 'check-question', component: CheckQuestionComponent
      },
      {
        path: 'generate-paper', component: GeneratePaperComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }