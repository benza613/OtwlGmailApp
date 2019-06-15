import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
//EmailBenComponent import
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

    this.mailList = this.emailStore.getCheckedMsgList$;
    console.log(this.mailList);
    // const modalRef = this.modalService.open(EmailBenComponent, { size: "lg" });
    // modalRef.componentInstance.threadData = this.mailList; // should be the id
  }

}
