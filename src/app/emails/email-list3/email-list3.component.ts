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
import { markdownListsTags } from '@syncfusion/ej2-richtexteditor';

@Component({
  selector: 'app-email-list3',
  templateUrl: './email-list3.component.html',
  styleUrls: ['./email-list3.component.scss']
})
export class EmailList3Component implements OnInit {

  @Input() storeSelector: string;
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  t_CollectionSize: number;
  t_currentPage = this.globals.currentPage;
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
    this.emailStore.draftThreadsCount$.subscribe(
      x => { this.t_CollectionSize = x; this.globals.pages = x; },
    );
    this.threadList = this.emailStore.draftThreads$.pipe(
      map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
    );
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.onClick_LoadAllMessages(threadData);
  }

  onClick_LoadAllMessages(threadData) {
    this.spinner.show('list3');
    this.authServ.login();
    const that = this;
    this.emailStore.update_DraftThreadEmails(1, threadData.ThreadId, 'draft', threadData['Messages'][0]['Id']).then(function (value) {
      threadData.isUnread = false;
      // threadData.isMapped = value[0] === '0' ? false : true;
      threadData.isMapped = false;
      that.spinner.hide('list3');
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
    this.globals.currentPage = 1;
    this.t_CollectionSize = this.globals.pages;
  }

  pageChange(event) {
    this.globals.currentPage = event;
  }

  clearDateField() {
    this.filterDate = null;
    this.applyFilter();
  }

  discardDraft(threadData) {
    this.spinner.show('list3');
    const that = this;
    this.emailStore.discardDraft(threadData.ThreadId).then(success => {
      that.emailStore.updateDraftThreadList(0, this.globals.draftFrom, this.globals.draftTo, this.globals.draftSubject).then(result => {
        that.doDraftPagination(2);
      });
      that.detector.detectChanges();
      that.spinner.hide('list3');
      alert('Draft deleted!');
    });
  }

  doDraftPagination(i) {
    const that = this;
    this.emailStore.paginateDraftThreadList(i).then(function (value) {
      if (value === undefined) {
        that.spinner.hide('list3');
      }
    });
    that.spinner.hide('list3');
  }

}
