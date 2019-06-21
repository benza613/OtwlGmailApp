import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './../confirm/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { DomainStoreService } from '../_store/domain-store.service';

@Component({
  selector: 'app-email-list2',
  templateUrl: './email-list2.component.html',
  styleUrls: ['./email-list2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailList2Component implements OnInit {
  @Input() storeSelector: string;
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  mappedThreads;
  threadTypeData;
  constructor(
    public emailStore: EmailsStoreService,
    private domainStore: DomainStoreService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
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
    console.log(this.threadTypeData);
  }

  showConfirmDialog(thread) {
      const modalRef = this.modalService.open(
        ConfirmDialogComponent,
        { size: 'lg', backdrop: 'static', keyboard: false }
      );
      modalRef.componentInstance.thread = thread;
      modalRef.componentInstance.response.subscribe((threadGId) => {
        console.log(threadGId);
        });
  }

}
