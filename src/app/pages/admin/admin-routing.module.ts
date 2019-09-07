import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CheckGroupComponent } from './check-group/check-group.component';
import { CheckStudentComponent } from './check-student/check-student.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: 'check-group', component: CheckGroupComponent
      },
      {
        path:'check-student',component:CheckStudentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
