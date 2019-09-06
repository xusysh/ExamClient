import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './pages/login/login.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component:LoginComponent },
  { path: 'student', loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule)},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminMoudle)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
