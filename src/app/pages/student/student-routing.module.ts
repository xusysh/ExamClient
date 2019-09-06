import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { CheckExamComponent } from './check-exam/check-exam.component';

const routes: Routes = [
  {
    path: '', component: StudentComponent, children: [
      {
        path: 'check-exam', component: CheckExamComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
