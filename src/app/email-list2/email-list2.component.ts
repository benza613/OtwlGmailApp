import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './../confirm/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { DomainStoreService } from '../_store/domain-store.service';
import { Subject } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

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

  debounceSearch: Subject<string> = new Subject();

  constructor(
    public emailStore: EmailsStoreService,
    private domainStore: DomainStoreService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.emailStore.mappedThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });

    // this.emailStore.mappedThreads$.subscribe(x => {
    //   this.mappedThreads = [];
    //   for (let ix = 0; ix < x.length; ix++) {
    //     this.mappedThreads = [...this.mappedThreads, x[ix]];
    //   }
    //   console.log('maps', this.mappedThreads);
    // });

    this.mappedThreads = this.emailStore.mappedThreads$;
    this.domainStore.threadTypeData$.subscribe(x => {
      this.threadTypeData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.threadTypeData = [...this.threadTypeData, x[ix]];
      }
      this.spinner.hide();
    });


  }

  showConfirmDialog(thread) {
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.thread = thread;
    modalRef.componentInstance.response.subscribe((threadGId) => {
      console.log(threadGId);
      this.mappedThreads = this.emailStore.mappedThreads$.pipe(
                              map(
                                y => y.filter(x => x.ThreadGID !== threadGId)
                              )
                            );
      console.log(this.mappedThreads);
      // this.mappedThreads = this.mappedThreads.filter(x => x.ThreadGID !== threadGId);
    });
  }

  applyFilter() {
    this.mappedFilterargs = { a: this.reference, b: this.threadTypeVal, c: this.subject };
    //this.debounceSearch.next(filterValue);
    //
  }

  onClick_GetThreadMessages(threadData) {
    this.emailStore.update_MappedThreadEmails(threadData.ThreadGID);
  }


  ngOnDestroy() {
    if (this.debounceSearch) {
      this.debounceSearch.unsubscribe();
    }
  }
}
