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
    private activeModal: NgbActiveModal
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
        console.log('DATA', this.res.threads);
        this.misc = `<table class="table table-striped" style="width: 100%">
                        <thead>
                          <th scope="col" style="text-align: center;">ID</th>
                          <th scope="col" style="text-align: center;">Subject</th>
                          <th scope="col" style="text-align: center;">Date</th>
                        </thead>
                        <tbody>
                          <tr *ngFor="let item of this.res.threads; index as i">
                            <td style="text-align: center;">{{item.ThreadId}}</td>
                            <td style="text-align: center;">{{item.Subject}}</td>
                            <td style="text-align: center;">{{item.Msg_Date}}</td>
                          </tr>
                        </tbody>
                     </table>`;
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
