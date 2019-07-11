import { Component, OnInit } from '@angular/core';
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
  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.emailStore.updateUnreadThreadList(this.addrFrom, this.addrTo, this.subject);
  }

  getMails() {
    this.spinner.show();
      this.emailStore.getCheckedMsgList$.subscribe(x => {
        this.mailList = x;
    });
    if (this.mailList.length > 0) {
      this.spinner.hide();
      const modalRef = this.modalService.open(
        EmailUnreadDialogComponent,
        { size: 'lg', backdrop: 'static', keyboard: false }
      );
      modalRef.componentInstance.mailList = this.mailList; // should be the id
      modalRef.result.then((result) => {
        if (result.action === '1') {
          modalRef.close();
        }
      });
    } else {
      alert('Please select atleast one row.');
      this.spinner.hide();
    }
  }

  fetchUnreadThreads() {
    // console.log(this.addrFrom, this.addrTo, this.subject);
    this.emailStore.updateUnreadThreadList(this.addrFrom, this.addrTo, this.subject);
  }

}
