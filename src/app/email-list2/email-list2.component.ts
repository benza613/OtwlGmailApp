import { GlobalStoreService } from 'src/app/_store/global-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './../confirm/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { DomainStoreService } from '../_store/domain-store.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth/auth.service';
import { EmailUnreadDialogComponent } from '../email-unread-dialog/email-unread-dialog.component';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-email-list2',
  templateUrl: './email-list2.component.html',
  styleUrls: ['./email-list2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailList2Component implements OnInit, OnDestroy {
  @Input() storeSelector: string;
  refId;
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;

  mappedFilterargs = { a: '', b: [], c: '' };
  mappedThreads;

  threadTypeData;

  threadTypeVal = [];
  subject = '';
  reference = '';
  remarks = '';
  editList = [];
  locst_id = null;
  showFilters = true;

  debounceSearch: Subject<string> = new Subject();

  constructor(
    public emailStore: EmailsStoreService,
    private domainStore: DomainStoreService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globals: GlobalStoreService
  ) { }

  ngOnInit() {
    // this.spinner.show('list2');
    // this.detector.detectChanges();
    this.emailStore.mappedThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });
    this.mappedThreads = this.emailStore.mappedThreads$;
    this.domainStore.threadTypeData$.subscribe(x => {
      this.threadTypeData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.threadTypeData = [...this.threadTypeData, x[ix]];
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params.locst_id != null) {
        this.locst_id = params.locst_id;
      }
    });
  }

  showConfirmDialog(thread) {
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.thread = thread;
    modalRef.componentInstance.response.subscribe((threadGId) => {
      this.spinner.show('list2');
      const date_from = moment(this.globals.mappedFromDate).subtract(1, 'month').format('YYYY/MM/DD');
        const date_to = moment(this.globals.mappedToDate).subtract(1, 'month').format('YYYY/MM/DD');
        // tslint:disable-next-line: max-line-length
        this.emailStore.updateMappedThreadList(this.globals.mappedRefId, this.globals.mappedRefValId, date_from, date_to, this.globals.isAdmin).then(success => {
        this.spinner.hide('list2');
        });
    });
  }

  applyFilter() {
    this.mappedFilterargs = { a: this.reference, b: this.threadTypeVal, c: this.subject, d: this.remarks };
    //this.debounceSearch.next(filterValue);
    //
  }

  onClick_GetThreadMessages(threadData) {
    this.spinner.show('list2');
    this.authServ.login();
    this.emailStore.update_MappedThreadEmails(threadData.ThreadGID, threadData.ThreadSubject, this.locst_id).then(success => {
      this.spinner.hide('list2');
    });
  }

  openUnreadDialog(flag, item) {
    const modalRef = this.modalService.open(
      EmailUnreadDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    if (flag === 1) {
      modalRef.componentInstance.mailList = [item];
    } else {
      modalRef.componentInstance.mailList = item;
    }
    modalRef.componentInstance.storeSelector = 'mapped';
    modalRef.result.then((result) => {
      if (result.action === '1') {
        this.spinner.show('list2');
        modalRef.close();
        const date_from = moment(this.globals.mappedFromDate).subtract(1, 'month').format('YYYY/MM/DD');
        const date_to = moment(this.globals.mappedToDate).subtract(1, 'month').format('YYYY/MM/DD');
        // tslint:disable-next-line: max-line-length
        this.emailStore.updateMappedThreadList(this.globals.mappedRefId, this.globals.mappedRefValId, date_from, date_to, this.globals.isAdmin).then(success => {
          this.spinner.hide('list2');
        });
      }
    });
  }

  checkList(item) {
    item.isChecked = !item.isChecked;
  }

  editThreadList() {
    this.editList = [];
    let list;
    this.mappedThreads.subscribe(x => {
      list = x;
    });
    list.forEach(x => {
      if (x.isChecked !== undefined && x.isChecked === true) {
        this.editList.push(x);
      }
    });
    if (this.editList.length === 0) {
      alert('Please select threads to edit.');
      return;
    }
    this.openUnreadDialog(2, this.editList);
  }

  ngOnDestroy() {
    if (this.debounceSearch) {
      this.debounceSearch.unsubscribe();
    }
  }
}
