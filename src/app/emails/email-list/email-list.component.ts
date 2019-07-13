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
export class EmailListComponent implements OnInit, OnChanges {
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
  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;

  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    console.log('On CHanges');
    this.spinner.show();
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      if (this.storeSelector === 'EmailUnreadComponent') {
        this.emailStore.unreadThreadsCount$.subscribe(x => {
          this.t_CollectionSize = x;
        });
        this.threadList = this.emailStore.unreadThreads$.pipe(
          map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
        );
      }
      this.spinner.hide();
      this.detector.detectChanges();
    }, 5000);
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.emailStore.update_UnreadThreadEmails(threadData.ThreadId, this.storeSelector, threadData.Subject);
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
  }

  clearDateField() {
    this.filterDate = null;
    this.applyFilter();
  }
}
