import { EmailDraftComponent } from './emails/email-draft/email-draft.component';
import { EmailSentComponent } from './emails/email-sent/email-sent.component';
import { ActivateGuardService } from './activate-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashViewComponent } from './dashboard/dash-view/dash-view.component';
import { EmailUnreadComponent } from './emails/email-unread/email-unread.component';
import { EmailMappedComponent } from './emails/email-mapped/email-mapped.component';
import { EmailViewComponent } from './emails/email-view/email-view.component';
import { EditorComponent } from './emails/editor/editor.component';

const routes: Routes = [
  {
    path: '',
    component: DashViewComponent,
    pathMatch: 'full'
  },
  {
    path: 'unread',
    component: EmailUnreadComponent,
    pathMatch: 'full',
  },
  {
    path: 'mapped',
    component: EmailMappedComponent,
    pathMatch: 'full',
    // canActivate: [ActivateGuardService]

  },
  {
    path: 'sent',
    component: EmailSentComponent,
    pathMatch: 'full',
  },
  {
    path: 'draft',
    component: EmailDraftComponent,
    pathMatch: 'full',
  },
  {
    path: 'editor',
    component: EditorComponent,
    pathMatch: 'full'
  },
  {
    path: 'view/:id',
    component: EmailViewComponent,
    pathMatch: 'full',
    canActivate: [ActivateGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
