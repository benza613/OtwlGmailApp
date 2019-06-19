import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
@Component({
  selector: 'app-email-unread',
  templateUrl: './email-unread.component.html',
  styleUrls: ['./email-unread.component.scss']
})
export class EmailUnreadComponent implements OnInit {
  dynamicdata: string = 'EmailUnreadComponent';
  mailList;
  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService
  ) { }

  ngOnInit() {
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
  }

  getMails() {

    this.emailStore.getCheckedMsgList$.subscribe(x => {
      this.mailList = x;
    });
    if (this.mailList.length > 0) {
      const modalRef = this.modalService.open(EmailUnreadDialogComponent, { size: 'lg', backdrop: 'static', keyboard: false});
      modalRef.componentInstance.mailList = this.mailList; // should be the id
    } else {
      alert('Please select atleast one row.');
    }
  }

}
