import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  @Input() res: any;
  @Input() methodName: string;
  constructor(
    private spinner: NgxSpinnerService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.res.d.errMsg);
    this.getContent();
  }

  getContent() {
    switch (this.methodName) {
      case 'indexUnread': {
        console.log(typeof this.res.threads);
        this.populateHtml(this.res.threads);
        break;
      }
      case 'getMappedThreads': {
        console.log(typeof this.res.mappedThreads);
        console.log(typeof this.res.threadTypeList);
        break;
      }
      case 'fetchThreadEmails': {
        console.log(typeof this.res.msgList);
        break;
      }
      case 'downloadLocal': {
        break;
      }
      case 'requestFSDir': {
        break;
      }
      case 'saveAttachmentToFS': {
        break;
      }
      case 'sendNewMail': {
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  populateHtml(content) {
    if (typeof content === 'number') {
      //saeHtml
    } else if (typeof content === 'object') {
      //safeHtml
    } else {
      //do something
    }
  }

}
