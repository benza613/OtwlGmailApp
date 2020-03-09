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
  misc = '';
  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    switch (this.methodName.trim()) {
      case 'indexUnread': {
        // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                   <th scope="col" style="text-align: center;">Date</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let item of this.res.d.threads">
        //                     <td style="text-align: center;">{{item.ThreadId}}</td>
        //                     <td style="text-align: center;">{{item.Subject}}</td>
        //                     <td style="text-align: center;">{{item.Msg_Date}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'getMappedThreads': {
        // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Refrence Text</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let item of this.res.d.mappedThreads">
        //                     <td style="text-align: center;">{{item.ThreadGID}}</td>
        //                     <td style="text-align: center;">{{item.ThreadReferenceText}}</td>
        //                     <td style="text-align: center;">{{item.Subject}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'fetchThreadEmails': {
         // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">FROM</th>
        //                   <th scope="col" style="text-align: center;">TO</th>
        //                   <th scope="col" style="text-align: center;">DATE</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let msg of this.res.d.msgList">
        //                     <td style="text-align: center;">{{msg.msgid}}</td>
        //                     <td style="text-align: center;">{{msg.from}}</td>
        //                     <td style="text-align: center;">{{msg.msgTo}}</td>
        //                     <td style="text-align: center;">{{msg.date}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'downloadLocal': {
        break;
      }
      case 'requestFSDir': {
         // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                   <th scope="col" style="text-align: center;">Date</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let folder of this.res.d.folders">
        //                     <td style="text-align: center;">{{folder.entityID}}</td>
        //                     <td style="text-align: center;">{{folder.isTemplateFolder_ID}}</td>
        //                     <td style="text-align: center;">{{folder.isParentFolder_ID}}</td>
        //                     <td style="text-align: center;">{{folder.name}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'saveAttachmentToFS': {
        break;
      }
      case 'sendNewMail': {
        break;
      }
      case 'fetchRefType': {
         // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                   <th scope="col" style="text-align: center;">Date</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let item of this.res.d.threads">
        //                     <td style="text-align: center;">{{item.ThreadId}}</td>
        //                     <td style="text-align: center;">{{item.Subject}}</td>
        //                     <td style="text-align: center;">{{item.Msg_Date}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'fetchRefTypeData': {
         // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                   <th scope="col" style="text-align: center;">Date</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let item of this.res.d.threads">
        //                     <td style="text-align: center;">{{item.ThreadId}}</td>
        //                     <td style="text-align: center;">{{item.Subject}}</td>
        //                     <td style="text-align: center;">{{item.Msg_Date}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'fetchThreadTypeData': {
         // this.misc = `<table class="table table-striped" style="width: 100%">
        //                 <thead>
        //                   <th scope="col" style="text-align: center;">ID</th>
        //                   <th scope="col" style="text-align: center;">Subject</th>
        //                   <th scope="col" style="text-align: center;">Date</th>
        //                 </thead>
        //                 <tbody>
        //                   <tr *ngFor="let item of this.res.d.threads">
        //                     <td style="text-align: center;">{{item.ThreadId}}</td>
        //                     <td style="text-align: center;">{{item.Subject}}</td>
        //                     <td style="text-align: center;">{{item.Msg_Date}}</td>
        //                   </tr>
        //                 </tbody>
        //              </table>`;
        break;
      }
      case 'submitUnreadThreadData': {
        // List of strings this.res.failThreads;
        break;
      }
      case 'deleteMapping': {
        //deleting thread mapping
      }
      default: {
        break;
      }
    }
  }

}
