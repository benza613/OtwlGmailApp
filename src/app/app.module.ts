import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashViewComponent } from './dashboard/dash-view/dash-view.component';
import { EmailUnreadComponent } from './emails/email-unread/email-unread.component';
import { EmailListComponent } from './emails/email-list/email-list.component';
import { EmailMappedComponent } from './emails/email-mapped/email-mapped.component';
import { EmailViewComponent } from './emails/email-view/email-view.component';
import { SafeHtmlPipe } from './_pipe/safe-html.pipe';
import { EmailMapComponent } from './emails/email-map/email-map.component';
import { EditorComponent } from './emails/editor/editor.component';
import { EmailUnreadDialogComponent } from './email-unread-dialog/email-unread-dialog.component';
import { EmailList2Component } from './email-list2/email-list2.component';
import { ErrorDialogComponent } from './error/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashViewComponent,
    EmailUnreadComponent,
    EmailListComponent,
    EmailMappedComponent,
    EmailViewComponent,
    SafeHtmlPipe,
    EmailMapComponent,
    EditorComponent,
    EmailUnreadDialogComponent,
    EmailList2Component,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    RichTextEditorAllModule,
    FileUploadModule,
    NgxSpinnerModule
  ],
  providers: [],
  entryComponents: [EditorComponent, EmailUnreadDialogComponent, ErrorDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
