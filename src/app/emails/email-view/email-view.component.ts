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
  body;
  quotes;
  locst_id = null;

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
        this.locst_id = params.locst_id;
        this.renderMessages();
      });
  }

  renderMessages() {
    this.spinner.show();
    if (this.storeSelector === 'unread') {
      this.body = [];
      this.quotes = [];
      this.emailStore.getUnreadMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          for (let i = 0; i < x.length; i++) {
            if (x[i].body.toLowerCase().trim().includes('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')) {

              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[0];

              this.quotes[i] = '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[1]);
            }
            else if (x[i].body.toLowerCase().trim().includes('<div class="gmail_quote">')) {
              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div class="gmail_quote">')[0];

              this.quotes[i] = '<div class="gmail_quote">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div class="gmail_quote">')[1]);
            } else if (x[i].body.toLowerCase().trim().includes('<div id="divSignatureLine">')) {
              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div id="divSignatureLine">')[0];

              this.quotes[i] = '<div id="divSignatureLine">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div id="divSignatureLine"')[1]);
            }
            else if (x[i].body.toLowerCase().trim().includes('<blockquote')) {
              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<blockquote')[0];

              this.quotes[i] = '<blockquote' +
                (x[i].body.toLowerCase().trim()
                  .split('<blockquote')[1]);
            } else {
              this.body[i] = x[i].body;
              this.quotes[i] = '';
            }
          }
          this.emailList = x;
        });
      this.spinner.hide();
    } else if (this.storeSelector === 'mapped') {
      this.body = [];
      this.quotes = [];
      this.emailStore.getMappedMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          for (let i = 0; i < x.length; i++) {
            if (x[i].body.toLowerCase().trim().includes('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')) {

              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[0];

              this.quotes[i] = '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[1]);
            }
            else if (x[i].body.toLowerCase().trim().includes('<div class="gmail_quote">')) {
              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div class="gmail_quote">')[0];

              this.quotes[i] = '<div class="gmail_quote">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div class="gmail_quote">')[1]);
            } else if (x[i].body.toLowerCase().trim().includes('<div id="divSignatureLine">')) {
              this.body[i] = x[i].body.toLowerCase().trim().split(
                '<div id="divSignatureLine">')[0];

              this.quotes[i] = '<div id="divSignatureLine">' +
                (x[i].body.toLowerCase().trim()
                  .split('<div id="divSignatureLine"')[1]);
            } else {
              this.body[i] = x[i].body;
              this.quotes[i] = '';
            }
          }
          this.emailList = x;
        });
      this.spinner.hide();
    }
  }


  draftReply(msg: Message) {
    let r_obj;
    if (this.locst_id !== null) {
      r_obj = {
        q: this.storeSelector,
        a: 'r',
        mid: msg.msgid,
        tid: this.reqThreadId,
        locst_id: this.locst_id
      };
    } else {
      r_obj = {
        q: this.storeSelector,
        a: 'r',
        mid: msg.msgid,
        tid: this.reqThreadId
      };
    }
    this.router.navigate(['draft/'], {
      queryParams: r_obj
    });
  }

  draftReplyToAll(msg: Message) {
    let ra_obj;
    if (this.locst_id !== null) {
      ra_obj = {
        q: this.storeSelector,
        a: 'ra',
        mid: msg.msgid,
        tid: this.reqThreadId,
        locst_id: this.locst_id
      };
    } else {
      ra_obj = {
        q: this.storeSelector,
        a: 'ra',
        mid: msg.msgid,
        tid: this.reqThreadId
      };
    }
    this.router.navigate(['draft/'], {
      queryParams: ra_obj
    });
  }


  draftForward(msg: Message) {
    let ra_obj;
    if (this.locst_id !== null) {
      ra_obj = {
        q: this.storeSelector,
        a: 'f',
        mid: msg.msgid,
        tid: this.reqThreadId,
        locst_id: this.locst_id
      };
    } else {
      ra_obj = {
        q: this.storeSelector,
        a: 'f',
        mid: msg.msgid,
        tid: this.reqThreadId
      };
    }

    this.router.navigate(['draft/'], {
      queryParams:ra_obj
    });
  }

  async fileAction(id, msgId, attachments, file?) {
    const that = this;
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
      this.emailServ.downloadLocal(msgId, this.downloadFileObject).then(function (value) {
        that.spinner.hide();
      });
    } else if (id === 2) {
      this.spinner.show();
      await this.emailStore.MessageAttch_RequestFSDir(this.reqThreadId).then(success => {
        that.spinner.hide();
        const modalRef = this.modalService.open(
          FSDirDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        let folderHeirarchy;
        this.emailStore.getFolderList$.subscribe(x => {
          folderHeirarchy = x;
        });
        modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
        modalRef.componentInstance.folderHierarchy = folderHeirarchy;
        modalRef.componentInstance.msgId = msgId;
        modalRef.componentInstance.attachmentGIds = this.attachmentGIDs;
        modalRef.componentInstance.attachmentNames = this.attachmentNames;
        modalRef.componentInstance.reqThreadId = this.reqThreadId;

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

  getPrint(id) {
    if (this.quotes !== '') {
      document.getElementById('footer_button').style.visibility = 'hidden';
    }
    let printContents, popupWin;
    printContents = document.getElementById(id).innerHTML;
    popupWin = window.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>${this.subject}</title>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
    );
    popupWin.document.close();
    if (this.quotes !== '') {
      document.getElementById('footer_button').style.visibility = 'visible';
    }
  }
}
