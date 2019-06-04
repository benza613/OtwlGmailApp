import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashViewComponent } from './dashboard/dash-view/dash-view.component';
import { EmailUnreadComponent } from './emails/email-unread/email-unread.component';
import { EmailMappedComponent } from './emails/email-mapped/email-mapped.component';

const routes: Routes = [
  {
    path: '',
    component: DashViewComponent,
    pathMatch: 'full'
  },
  {
    path: 'unread',
    component: EmailUnreadComponent,
    pathMatch: 'full'
  },
  {
    path: 'mapped',
    component: EmailMappedComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
