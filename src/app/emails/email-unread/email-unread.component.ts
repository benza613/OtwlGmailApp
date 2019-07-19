import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    // setTimeout(() => {
    //   this.spinner.show();
    //   this.detector.detectChanges();
    // }, 5000);
      this.emailStore.updateUnreadThreadList('user init', this.addrFrom, this.addrTo, this.subject).then(result => {
        this.spinner.hide();
      });
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
        }
      });
    } else {
      alert('Please select atleast one row.');
      // this.spinner.hide('load');
    }
  }

  fetchUnreadThreads() {
    this.showLoaders = true;
    const that = this;
    this.emailStore.updateUnreadThreadList('user demand', this.addrFrom, this.addrTo, this.subject).then(function (value) {
      if (value === undefined) {
        that.showLoaders = false;
      }
    });
  }

}
