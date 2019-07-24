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
import { ConfirmDialogComponent } from './confirm/confirm-dialog/confirm-dialog.component';
import { mapViewFilter } from './_pipe/map-view-filter.pipe';
import { FSDirDialogComponent } from './email_fs_dir/fs-dir-dialog/fs-dir-dialog.component';
import { LocalStorageService } from './_util/local-storage.service';
import { UnreadViewFilterPipe } from './_pipe/unread-view-filter.pipe';
import { FSFilesDialogComponent } from './email_fs_files/fsfiles-dialog/fsfiles-dialog.component';
import { FileFilterPipe } from './_pipe/file-filter.pipe';
import { EmailSentComponent } from './emails/email-sent/email-sent.component';


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
    ErrorDialogComponent,
    ConfirmDialogComponent,
    mapViewFilter,
    FSDirDialogComponent,
    UnreadViewFilterPipe,
    FSFilesDialogComponent,
    FileFilterPipe,
    EmailSentComponent
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
  providers: [LocalStorageService],
  entryComponents: [
    EditorComponent,
    EmailUnreadDialogComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent,
    FSDirDialogComponent,
    FSFilesDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
