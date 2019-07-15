import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './../confirm/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { DomainStoreService } from '../_store/domain-store.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth/auth.service';
import { filter, map } from 'rxjs/operators';
import { EmailUnreadDialogComponent } from '../email-unread-dialog/email-unread-dialog.component';

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
  editList = [];

  debounceSearch: Subject<string> = new Subject();

  constructor(
    public emailStore: EmailsStoreService,
    private domainStore: DomainStoreService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private authServ: AuthService,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.spinner.show('list2');
    this.detector.detectChanges();
    this.emailStore.mappedThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });

    setTimeout(() => {
      this.mappedThreads = this.emailStore.mappedThreads$;
      this.domainStore.threadTypeData$.subscribe(x => {
        this.threadTypeData = [];
        for (let ix = 0; ix < x.length; ix++) {
          this.threadTypeData = [...this.threadTypeData, x[ix]];
        }
        this.spinner.hide('list2');
        this.detector.detectChanges();
      });
    }, 3000);
  }

  showConfirmDialog(thread) {
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.thread = thread;
    modalRef.componentInstance.response.subscribe((threadGId) => {
      this.mappedThreads = this.emailStore.mappedThreads$;
    });
  }

  applyFilter() {
    this.mappedFilterargs = { a: this.reference, b: this.threadTypeVal, c: this.subject };
    //this.debounceSearch.next(filterValue);
    //
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.emailStore.update_MappedThreadEmails(threadData.ThreadGID, threadData.ThreadSubject);
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
        modalRef.close();
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
    console.log('MAPPED LIST', this.mappedThreads);
    console.log('EDIT LIST', this.editList);
    this.openUnreadDialog(2, this.editList);
  }

  ngOnDestroy() {
    if (this.debounceSearch) {
      this.debounceSearch.unsubscribe();
    }
  }
}
