import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashViewComponent } from './dashboard/dash-view/dash-view.component';
import { EmailUnreadComponent } from './emails/email-unread/email-unread.component';
import { EmailListComponent } from './emails/email-list/email-list.component';
import { EmailMappedComponent } from './emails/email-mapped/email-mapped.component';

@NgModule({
  declarations: [
    AppComponent,
    DashViewComponent,
    EmailUnreadComponent,
    EmailListComponent,
    EmailMappedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
