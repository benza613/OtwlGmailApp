import { filter } from 'rxjs/operators';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailListComponent implements OnInit {
  @Input() storeSelector: string;
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
    private authServ: AuthService
  ) {

  }

  ngOnInit() {
    this.spinner.show();
    if (this.storeSelector === "EmailUnreadComponent") {
      this.emailStore.unreadThreadsCount$.subscribe(x => {
        this.t_CollectionSize = x;
      });
      this.threadList = this.emailStore.unreadThreads$;
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.emailStore.update_UnreadThreadEmails(threadData.ThreadId, this.storeSelector, threadData.Subject);
  }

  checkList(item) {
    item.isChecked = !item.isChecked;
  }

  applyFilter() {
    const date = moment(this.filterDate).subtract(1, 'month').format('YYYY-MM-DD');
    console.log('subject', this.filterSubject);
    console.log('date', moment(this.filterDate).subtract(1, 'month').format('YYYY-MM-DD'));
    this.unreadFilterArgs = {
      a: this.filterFrom, b: this.filterSubject,
      c: date === 'Invalid date' ? '' : date
    };
  }
}
