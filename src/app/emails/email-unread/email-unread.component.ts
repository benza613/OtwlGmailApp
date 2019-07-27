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
  dynamicdata: string = 'EmailUnreadComponent';
  mailList = [];
  addrFrom;
  addrTo;
  subject;
  fetch;
  isCollapsed = true;
  showLoaders = false;
  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.showLoaders = true;
    this.emailStore.updateUnreadThreadList(0, this.addrFrom, this.addrTo, this.subject).then(result => {
      console.log('promise succ for updateUnreadThreadList');
      this.spinner.hide();
      this.doUnreadPagination(9);
    }, err => {
      this.spinner.hide();
      console.log('promise reject for updateUnreadThreadList');
    });
    interval(2000 * 60).subscribe(x => {
      this.emailStore.updateUnreadThreadList(0, this.addrFrom, this.addrTo, this.subject).then(result => {
        console.log('promise succ for updateUnreadThreadList');
        this.spinner.hide();
        this.doUnreadPagination(9);
      }, err => {
        this.spinner.hide();
        console.log('promise reject for updateUnreadThreadList');
      });
    });
  }

  getLatestThreads() {
    // this.showLoaders = true;
  }

  getMails() {
    // this.spinner.show('load');
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
            x.filter(y => y.isChecked === true).forEach(thread =>{
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

  fetchUnreadThreads(i) {
    this.emailStore.updateUnreadThreadList(i, this.addrFrom, this.addrTo, this.subject).then(result => {
      this.spinner.hide();
      this.doUnreadPagination(i - 1);
    });
  }

  doUnreadPagination(i) {
    const that = this;
    this.emailStore.paginateUnreadThreadList(i).then(function (value) {
      if (value === undefined) {
        that.showLoaders = false;
      }
    });
  }

}
