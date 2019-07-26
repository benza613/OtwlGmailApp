import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {

  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  sentThreads;
  storeSelector = 'sent';
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  filterFrom;
  filterSubject;
  filterDate: NgbDateStruct = null;
  sentFilterArgs = { a: '', b: '', c: '' };
  showLoaders = false;
  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;
  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.showLoaders = true;
    this.emailStore.updateSentThreadList().then(success => {
      this.doSentPagination(10);
      this.detector.detectChanges();
    });
    this.emailStore.sentThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });
    this.sentThreads = this.emailStore.sentThreads$.pipe(
      map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
    );
    this.detector.detectChanges();
  }

  doSentPagination(i) {
    this.showLoaders = true;
    const that = this;
    this.emailStore.paginateSentThreadList(i).then(function (value) {
      if (value === undefined) {
        that.showLoaders = false;
      }
    });
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.emailStore.update_SentThreadEmails(threadData.ThreadId, this.storeSelector, threadData.Subject);
  }

  applyFilter() {
    this.detector.detectChanges();
    const date = moment(this.filterDate).subtract(1, 'month').format('YYYY-MM-DD');
    this.sentFilterArgs = {
      a: this.filterFrom, b: this.filterSubject,
      c: date === 'Invalid date' ? '' : date
    };
  }

  clearDateField() {
    this.filterDate = null;
    this.applyFilter();
  }

}