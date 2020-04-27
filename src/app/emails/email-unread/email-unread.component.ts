import { ErrorService } from 'src/app/error/error.service';
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


/*
* 1. This component forms the inbox of the user. All the mails received by the user are showed up here.
* 2. The mails load in a batch of 10. Initially, only first 30 mails are loaded.
* 3. If the user wants previous mails, options are provided to load the number of mails he wished to check
* 4. The user can choose to filter out specific mails using the 'Search' section. He can enter from, to and/or subject that he is looking for
* 5. The list of emails showing up is displayed using the EmailListComponent.
*/


export class EmailUnreadComponent implements OnInit {
  dynamicdata: string = 'EmailUnreadComponent'; //common parameter in all components to indicate which store the user has come from
  mailList = [];
  isCollapsed = true; // used to toggle the search inputs.
  showLoaders = false; // used to toggle the loading animation
  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService,
    private detector: ChangeDetectorRef,
    public globals: GlobalStoreService,
    public router: Router,
    private errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.domainStore.updateFSTags();
    this.showLoaders = true;
    const that = this;
    this.emailStore.updateUnreadThreadList(0, this.globals.unreadFrom, this.globals.unreadTo, this.globals.unreadSubject).then(result => {
      that.showLoaders = false;
      if (result[0] !== '200') {
        const res = {
          d: {
            errId: '',
            errMsg: ''
          }
        };
        res.d.errId = result[0];
        res.d.errMsg = result[1];
        that.errorService.displayError(res, 'getMappedThreads');
      }
      that.doUnreadPagination(2);
    }, err => {
      this.spinner.hide();
      that.showLoaders = false;
    });
  }

  /*
  * This function is used to get all threads selected to map by the user and display it in the dialog.
  */
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

  /* 
  * This method is used to fetch filtered threads from users inbox 
  */
  fetchUnreadThreads(i) {
    const that = this;
    this.showLoaders = true;
    this.emailStore.updateUnreadThreadList(i, this.globals.unreadFrom, this.globals.unreadTo, this.globals.unreadSubject).then(result => {
      this.spinner.hide();
      this.doUnreadPagination(i - 1);
    });
  }

  /* 
  * This method is used to keep on fetching threads continuously for 'i' iterations. 
  * Each iteration fetched 10 threads.
  */
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
