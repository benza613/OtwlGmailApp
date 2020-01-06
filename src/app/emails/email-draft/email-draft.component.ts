import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalStoreService } from 'src/app/_store/global-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-unread',
  templateUrl: './email-draft.component.html',
  styleUrls: ['./email-draft.component.scss']
})
export class EmailDraftComponent implements OnInit {
  dynamicdata = 'EmailDraftComponent';
  mailList = [];
  fetch;
  isCollapsed = true;
  showLoaders = false;
  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService,
    private detector: ChangeDetectorRef,
    public globals: GlobalStoreService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.showLoaders = true;
    const that = this;
    this.emailStore.updateDraftThreadList(0, this.globals.draftFrom, this.globals.draftTo, this.globals.draftSubject).then(result => {
      that.showLoaders = false;
      that.doDraftPagination(2);
    }, err => {
      this.spinner.hide();
      that.showLoaders = false;
    });
  }

  fetchDraftThreads(i) {
    const that = this;
    this.isCollapsed = true;
    this.showLoaders = true;
    this.emailStore.updateDraftThreadList(i, this.globals.draftFrom, this.globals.draftTo, this.globals.draftSubject).then(result => {
      that.spinner.hide();
      that.doDraftPagination(i - 1);
    });
  }

  getMails() {
    this.emailStore.getCheckedMsgList$.subscribe(x => {
      this.mailList = x;
    });
    // if (this.mailList.length > 0) {
    //   this.spinner.hide('load');
    //   const modalRef = this.modalService.open(
    //     EmailUnreadDialogComponent,
    //     { size: 'lg', backdrop: 'static', keyboard: false }
    //   );
    //   modalRef.componentInstance.mailList = this.mailList;
    //   modalRef.componentInstance.storeSelector = 'unread'; // should be the id
    //   modalRef.result.then((result) => {
    //     if (result.action === '1') {
    //       modalRef.close();
    //       this.emailStore.unreadThreads$.subscribe(x => {
    //         x.filter(y => y.isChecked === true).forEach(thread => {
    //           thread.isMapped = true;
    //           thread.isChecked = false;
    //         });
    //       });
    //     }
    //   });
    // } else {
    //   alert('Please select atleast one row.');
    // }
  }

  doDraftPagination(i) {
    const that = this;
    this.showLoaders = true;
    this.emailStore.paginateDraftThreadList(i).then(function (value) {
      if (value === undefined) {
        that.showLoaders = false;
      }
    });
  }

}
