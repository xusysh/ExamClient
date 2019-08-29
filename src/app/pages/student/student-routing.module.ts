import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';

const routes: Routes = [
  { path: '', component: StudentComponent },
  { path: 'check-exam', loadChildren: () => import('./check-exam/check-exam.module').then(m => m.CheckExamModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
