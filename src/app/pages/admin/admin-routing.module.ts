import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CheckGroupComponent } from './check-group/check-group.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {
        path: 'check-group', component: CheckGroupComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
