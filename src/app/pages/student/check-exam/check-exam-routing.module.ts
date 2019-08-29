import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckExamComponent } from './check-exam.component';

const routes: Routes = [
  { path: '', component: CheckExamComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckExamRoutingModule { }
