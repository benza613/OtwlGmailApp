import { GlobalStoreService } from './../../_store/global-store.service';
import { Router } from '@angular/router';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailListComponent implements OnInit {
  /* 
  * 1. This checks the component is being called from which section of Gmail App 
  * 2. If you have to write section specific conditions, that can be achieved using the storeSelector parameter
  */
  @Input() storeSelector: string;

  /* Event fired when date is selected for filtering  */
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();

  /* Pagination Variables */
  t_CollectionSize: number;
  t_currentPage = this.globals.currentPage;
  t_itemsPerPage = 10;

  /* List of all threads */
  threadList;

  /* Filter Variables */
  filterFrom;
  filterSubject;
  filterDate: NgbDateStruct = null;
  unreadFilterArgs = { a: '', b: '', c: '' };
  showPreview = false;
  currentThread = null;
  msg;

  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;

  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
    private domainStore: DomainStoreService,
    private router: Router,
    public globals: GlobalStoreService,
  ) { }

  ngOnInit() {
    /* 
    * 1. Check from which store the user has come.
    * 2. Fetch the list of threads accordingly.
    */
    if (this.storeSelector === 'EmailUnreadComponent') {
      this.emailStore.unreadThreadsCount$.subscribe(
        x => { this.t_CollectionSize = x; this.globals.pages = x; },
      );
      this.threadList = this.emailStore.unreadThreads$.pipe(
        map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
      );
    } else if (this.storeSelector === 'EmailDraftComponent') {
      this.emailStore.draftThreadsCount$.subscribe(
        x => { this.t_CollectionSize = x; this.globals.pages = x; },
      );
      this.threadList = this.emailStore.draftThreads$.pipe(
        map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
      );
    } else {
      this.emailStore.sentThreadsCount$.subscribe(x => {
        this.t_CollectionSize = x;
        this.globals.pages = x;
      });
      this.threadList = this.emailStore.sentThreads$.pipe(
        map(mails =>
          mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime())
        )
      );
    }
  }

  /* Function to fetch mails for the selected thread. */
  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.onClick_LoadAllMessages(threadData);
  }

  /* A preview of the latest mail in that particular thread */
  getPreview(threadData) {
    this.spinner.show('list1');
    const that = this;
    if (this.storeSelector === 'EmailUnreadComponent') {
      this.emailStore.update_UnreadThreadEmails(0, threadData.ThreadId, this.storeSelector, threadData.Subject, threadData.DRIVE_VIEWSTATE_ID, threadData.DRIVE_VIEWSTATE_OWNER).then(function (value) {
        threadData.isUnread = false;
        threadData.isMapped = value[0] === '0' ? false : true;
        that.emailStore.getUnreadMsgList$(threadData.ThreadId)
          .pipe(
            map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
          ).subscribe(x => {
            that.msg = x[0];
          });
        that.showPreview = true;
        that.currentThread = threadData.ThreadId;
        that.spinner.hide('list1');
      });
    } else if (this.storeSelector === 'EmailDraftComponent') {
      this.emailStore.update_DraftThreadEmails(0, threadData.ThreadId, threadData.DRIVE_VIEWSTATE_ID, threadData.DRIVE_VIEWSTATE_OWNER, this.storeSelector, threadData.Subject).then(function (value) {
        threadData.isUnread = false;
        // threadData.isMapped = value[0] === '0' ? false : true;
        that.emailStore.getDraftMsgList$(threadData.ThreadId)
          .pipe(
            map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
          ).subscribe(x => {
            that.msg = x[0];
          });
        that.showPreview = true;
        that.currentThread = threadData.ThreadId;
        that.spinner.hide('list1');
      });
    }
  }


  onClick_LoadAllMessages(threadData) {
    this.spinner.show('list1');
    this.authServ.login();
    const that = this;
    if (this.storeSelector === 'EmailUnreadComponent') {
      this.emailStore.update_UnreadThreadEmails(1, threadData.ThreadId, this.storeSelector, threadData.Subject, threadData.DRIVE_VIEWSTATE_ID, threadData.DRIVE_VIEWSTATE_OWNER).then(function (value) {
        threadData.isUnread = false;
        threadData.isMapped = value[0] === '0' ? false : true;
        that.spinner.hide('list1');
      });
    } else {
      this.emailStore.update_SentThreadEmails(threadData.ThreadId, 'sent', threadData.Subject, threadData.DRIVE_VIEWSTATE_ID, threadData.DRIVE_VIEWSTATE_OWNER).then(function (value) {
        threadData.isUnread = false;
        // threadData.isMapped = value[0] === '0' ? false : true;
        that.spinner.hide('list1');
      });
    }
  }

  checkList(item) {
    item.isChecked = !item.isChecked;
  }

  applyFilter() {
    this.detector.detectChanges();
    const date = moment(this.filterDate).subtract(1, 'month').format('YYYY-MM-DD');
    this.unreadFilterArgs = {
      a: this.filterFrom, b: this.filterSubject,
      c: date === 'Invalid date' ? '' : date
    };
    this.globals.currentPage = 1;
    this.t_CollectionSize = this.globals.pages;
  }

  /* Delete a thread from mailbox */
  deleteThread(thread) {
    this.spinner.show('list1');
    const that = this;
    const refValId = null;
    this.emailStore.deleteMail(thread.ThreadId, '', refValId).then(success => {
      //remove that thread from the list
      that.threadList = that.emailStore.unreadThreads$;
      that.spinner.hide('list1');
    });
  }

  pageChange(event) {
    this.globals.currentPage = event;
  }

  clearDateField() {
    this.filterDate = null;
    this.applyFilter();
  }
}
