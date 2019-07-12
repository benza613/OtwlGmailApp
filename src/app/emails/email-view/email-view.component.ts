import { FSDirDialogComponent } from 'src/app/email_fs_dir/fs-dir-dialog/fs-dir-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Message } from '../../models/message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from 'src/app/_http/emails.service';


@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit {

  /// DO NOT DELETE THIS COMMENT
  /// https://github.com/SyncfusionExamples/ej2-angular-7-rich-text-editor
  /// https://www.syncfusion.com/kb/9864/how-to-get-started-easily-with-syncfusion-angular-7-rich-text-editor


  reqThreadId;
  storeSelector;
  refId;
  emailList;
  details = false;
  attachmentGIDs = [];
  attachmentNames = [];
  selectAll = true;
  downloadFileObject = [];
  action = true;
  subject;
  showInfo = false;
  showAttachments = false;
  showQuotes = true;

  constructor(
    private route: ActivatedRoute,
    public emailStore: EmailsStoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private emailServ: EmailsService
  ) { }

  ngOnInit() {
    this.reqThreadId = this.route.snapshot.paramMap.get('id');

    this.route.queryParams
      .subscribe(params => {
        // console.log(params);
        this.storeSelector = params.q;
        this.refId = params.j;
        this.subject = params.subject;
        this.renderMessages();
      });
  }

  renderMessages() {
    this.spinner.show();
    if (this.storeSelector === 'unread') {
      this.emailStore.getUnreadMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
        });
      this.spinner.hide();
    } else if (this.storeSelector === 'mapped') {
      this.emailStore.getMappedMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
        });
      this.spinner.hide();
    }
  }

  draftReply(msg: Message) {
    this.router.navigate(['draft/'], {
      queryParams:
      {
        q: this.storeSelector,
        a: 'r',
        mid: msg.msgid,
        tid: this.reqThreadId
      }
    });
  }

  draftReplyToAll(msg: Message) {
    this.router.navigate(['draft/'], {
      queryParams:
      {
        q: this.storeSelector,
        a: 'ra',
        mid: msg.msgid,
        tid: this.reqThreadId
      }
    });
  }


  draftForward(msg: Message) {
    this.router.navigate(['draft/'], {
      queryParams:
      {
        q: this.storeSelector,
        a: 'f',
        mid: msg.msgid,
        tid: this.reqThreadId
      }
    });
  }

  async fileAction(id, msgId, attachments, file?) {
    this.attachmentGIDs = [];
    this.attachmentNames = [];
    this.downloadFileObject = [];
    if (file) {
      this.attachmentGIDs.push(file.attachmentGId);
      this.attachmentNames.push(file.fileName);
      this.downloadFileObject.push([file.attachmentGId, file.fileName]);
    } else {
      if (id === 3) {
        this.selectAll = !this.selectAll;
        attachments.forEach(att => {
          att.isChecked = this.selectAll === false ? true : false;
          if (att.isChecked === true) {
            this.attachmentGIDs.push(att.attachmentGId);
            this.attachmentNames.push(att.fileName);
          } else {
            this.attachmentGIDs = [];
            this.attachmentNames = [];
          }
        });
      } else {
        const attachments_filtered = attachments.filter(x => x.isChecked === true);
        attachments_filtered.forEach(att => {
          this.attachmentGIDs.push(att.attachmentGId);
          this.attachmentNames.push(att.fileName);
          this.downloadFileObject.push([att.attachmentGId, att.fileName]);
        });
      }
    }

    if (id === 1) {
      this.spinner.show();
      const that = this;
      this.emailServ.downloadLocal(msgId, this.downloadFileObject).then(function (value) {
        console.log(value);

        that.spinner.hide();
      });
    } else if (id === 2) {
      this.spinner.show();
      await this.emailStore.MessageAttch_RequestFSDir(this.reqThreadId).then(success => {
        this.spinner.hide();
        const modalRef = this.modalService.open(
          FSDirDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        this.emailStore.getFolderList$.subscribe(x => {
          modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
          modalRef.componentInstance.folderHierarchy = x;
          modalRef.componentInstance.msgId = msgId;
          modalRef.componentInstance.attachmentGIds = this.attachmentGIDs;
          modalRef.componentInstance.attachmentNames = this.attachmentNames;
          modalRef.componentInstance.reqThreadId = this.reqThreadId;
        });

      });

    }
  }

  expandAll(flag) {
    this.action = !this.action;
    if (flag === 1) {
      this.emailList.forEach(x => {
        x.isOpen = true;
    });
    } else {
      this.emailList.forEach(x => {
        x.isOpen = false;
    });
    }
  }

}
