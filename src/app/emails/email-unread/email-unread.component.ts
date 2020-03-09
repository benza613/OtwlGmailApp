import { Router } from '@angular/router';
import { GlobalStoreService } from './../../_store/global-store.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval } from 'rxjs';

@Component({
  selector: 'app-email-unread',
  templateUrl: './email-unread.component.html',
  styleUrls: ['./email-unread.component.scss']
})
export class EmailUnreadComponent implements OnInit {
  dynamicdata: string = 'EmailUnreadComponent'; //common parameter in all components to indicate which store the user has come from
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
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.domainStore.updateFSTags();
    this.showLoaders = true;
    const that = this;
    this.emailStore.updateUnreadThreadList(0, this.globals.unreadFrom, this.globals.unreadTo, this.globals.unreadSubject).then(result => {
      that.showLoaders = false;
      that.doUnreadPagination(2);
    }, err => {
      this.spinner.hide();
      that.showLoaders = false;
    });
  }

  getMails() {
    this.emailStore.getCheckedMsgList$.subscribe(x => {
      this.mailList = x;
    });
    if (this.mailList.length > 0) {
      this.spinner.hide('load');
      const modalRef = this.modalService.open(
        EmailUnreadDialogComponent,
        { size: 'lg', backdrop: 'static', keyboard: false }
      );
      modalRef.componentInstance.mailList = this.mailList;
      modalRef.componentInstance.storeSelector = 'unread'; // should be the id
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
    }
  }

  /* method to fetch filtered threads from users inbox */
  fetchUnreadThreads(i) {
    const that = this;
    this.showLoaders = true;
      this.emailStore.updateUnreadThreadList(i, this.globals.unreadFrom, this.globals.unreadTo, this.globals.unreadSubject).then(result => {
        this.spinner.hide();
        this.doUnreadPagination(i - 1);
      });
  }

  /* method to keep on fetching mails */
  doUnreadPagination(i) {
    const that = this;
    this.showLoaders = true;
    this.emailStore.paginateUnreadThreadList(i).then(function (value) {
      if (value === undefined) {
        that.showLoaders = false;
      }
    });
  }
}
