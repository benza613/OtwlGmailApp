import { LocalStorageService } from './../../_util/local-storage.service';
import { GlobalStoreService } from './../../_store/global-store.service';
import { Message } from './../../models/message.model';
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
  @Input() storeSelector: string;
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  threadList;
  modalList = [];
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
    if (this.storeSelector === 'EmailUnreadComponent') {
      this.emailStore.unreadThreadsCount$.subscribe(
        x => { this.t_CollectionSize = x; this.globals.pages = x; },
      );
      this.threadList = this.emailStore.unreadThreads$.pipe(
        map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
      );
    } else {
      this.emailStore.sentThreadsCount$.subscribe(x => {
        this.t_CollectionSize = x;
        this.globals.pages = x;
      });
      this.threadList = this.emailStore.sentThreads$.pipe(
        map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
      );
    }
  }

  onClick_GetThreadMessages(threadData) {
    const that = this;
    this.spinner.show('list1');
    this.authServ.login();
    if (this.currentThread !== threadData.ThreadId) {
      //then fetch messages and display preview of first message
      this.emailStore.update_UnreadThreadEmails(0, threadData.ThreadId, this.storeSelector, threadData.Subject).then(function (value) {
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
    } else {
      this.onClick_LoadAllMessages(threadData);
    }
  }

  onClick_LoadAllMessages(threadData) {
    this.spinner.show('list1');
    this.authServ.login();
    const that = this;
    this.emailStore.update_UnreadThreadEmails(1, threadData.ThreadId, this.storeSelector, threadData.Subject).then(function (value) {
      threadData.isUnread = false;
      threadData.isMapped = value[0] === '0' ? false : true;
      that.spinner.hide('list1');
    });
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
    this.t_currentPage = 1;
    this.t_CollectionSize = this.globals.pages;
    console.log(this.t_CollectionSize);
  }

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

  clearDateField() {
    this.filterDate = null;
    this.applyFilter();
  }
}
