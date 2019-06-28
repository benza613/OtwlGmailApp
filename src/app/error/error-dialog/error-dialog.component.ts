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
  @Input() methodName: any;
  misc;
  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.methodName);
    this.getContent();
    // this.misc = `<div>
    // <span>HELLO</span><br/><span>world</span>
    // </div>`;
  }

  getContent() {
    switch (this.methodName.trim()) {
      case 'indexUnread': {
        console.log('DATA TYPE', typeof this.res.threads);
        this.populateHtml(this.res.threads);
        break;
      }
      case 'getMappedThreads': {
        this.populateHtml(this.res.mappedThreads);
        this.populateHtml(this.res.threadTypeList);
        break;
      }
      case 'fetchThreadEmails': {
        this.populateHtml(this.res.msgList);
        console.log(typeof this.res.msgList);
        break;
      }
      case 'downloadLocal': {
        break;
      }
      case 'requestFSDir': {
        this.populateHtml(this.res.folder);
        break;
      }
      case 'saveAttachmentToFS': {
        break;
      }
      case 'sendNewMail': {
        break;
      }
      case 'fetchRefType': {
        this.populateHtml(this.res.refTypes);
        break;
      }
      case 'fetchRefTypeData': {
        this.populateHtml(this.res.refData);
        break;
      }
      case 'fetchThreadTypeData': {
        this.populateHtml(this.res.refData);
        break;
      }
      case 'submitUnreadThreadData': {
        // List of strings this.res.failThreads;
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  populateHtml(content) {
    if (typeof content === 'string') {
      //safeHtml
    } else if (typeof content === 'object') {
      console.log(content);
      this.misc = `<div *ngFor="let item of content">
                        <span>item</span>
                    </div>`;
    } else {
      //do something
    }
  }

}
