import { Router } from '@angular/router';
import { GlobalStoreService } from 'src/app/_store/global-store.service';
import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
import { DomainStoreService } from 'src/app/_store/domain-store.service';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrls: ['./email-sent.component.scss']
})
export class EmailSentComponent implements OnInit {

  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  dynamicdata: string = 'EmailSentComponent';
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
  showFilters = false;
  threadTypeData;
  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;
  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
    public globals: GlobalStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.showLoaders = true;
    this.showLoaders = true;
    const that = this;
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.emailStore.updateSentThreadList(0, this.globals.sentTo, this.globals.sentSubject).then(result => {
      that.showLoaders = false;
      console.log('promise succ for updateUnreadThreadList');
      this.doSentPagination(2);
    }, err => {
      this.spinner.hide();
      that.showLoaders = false;
      console.log('promise reject for updateUnreadThreadList');
    });
    // this.emailStore.sentThreadsCount$.subscribe(x => {
    //   this.t_CollectionSize = x;
    // });
    // this.sentThreads = this.emailStore.sentThreads$.pipe(
    //   map(mails => mails.sort((a, b) => new Date(b.Msg_Date).getTime() - new Date(a.Msg_Date).getTime()))
    // );
    // this.detector.detectChanges();
  }

  fetchSentThreads(i) {
    this.showLoaders = true;
    this.emailStore.updateSentThreadList(i, this.globals.unreadTo, this.globals.unreadSubject).then(result => {
      this.showLoaders = false;
      this.doSentPagination(i - 1);
    });
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

  checkList(item) {
    item.isChecked = !item.isChecked;
  }

  getMails() {
    // this.spinner.show('load');
    this.emailStore.getSentCheckedMsgList$.subscribe(x => {
      this.sentThreads = x;
    });
    if (this.sentThreads.length > 0) {
      this.spinner.hide('load');
      const modalRef = this.modalService.open(
        EmailUnreadDialogComponent,
        { size: 'lg', backdrop: 'static', keyboard: false }
      );
      modalRef.componentInstance.mailList = this.sentThreads;
      modalRef.componentInstance.storeSelector = 'sent'; // should be the id
      modalRef.result.then((result) => {
        if (result.action === '1') {
          modalRef.close();
          this.emailStore.unreadThreads$.subscribe(x => {
            x.filter(y => y.isChecked === true).forEach(thread => {
              thread.isMapped = true;
              thread.isChecked = false;
            });
          });
        }
      });
    } else {
      alert('Please select atleast one row.');
      // this.spinner.hide('load');
    }
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
