import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//EmailBenComponent import
@Component({
  selector: 'app-email-unread',
  templateUrl: './email-unread.component.html',
  styleUrls: ['./email-unread.component.scss']
})
export class EmailUnreadComponent implements OnInit {
  dynamicdata: string = 'EmailUnreadComponent';

  constructor() { }

  ngOnInit() {
  }

  // btnclick{

  // resx = this.emailStore.to call filtered ischecked
  /**
   *    const modalRef = this.modalService.open(EmailBenComponent, { size: "lg" });
      modalRef.componentInstance.threadData = resx; // should be the id
  
      modalRef.result.then((result) => {
        console.log(result);
  
        if (result.action == "submit" && result.data.length > 0) {
  
        }
      }).catch((error) => {
        console.log('dismiss');
  });
   */
  //}
  
}
