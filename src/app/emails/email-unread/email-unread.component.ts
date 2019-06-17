import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
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
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  getMails() {

    this.emailStore.getCheckedMsgList$.subscribe(x => {
      this.mailList = x;
    });
    if (this.mailList.length > 0) {
      const modalRef = this.modalService.open(EmailUnreadDialogComponent, { size: "lg" });
      modalRef.componentInstance.mailList = this.mailList; // should be the id
    } else {
      alert('Please select atleast one row.');
    }
  }

}
