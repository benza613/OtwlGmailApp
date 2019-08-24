import { GlobalStoreService } from './../../_store/global-store.service';
import { ConfirmDialogComponent } from './../../confirm/confirm-dialog/confirm-dialog.component';
import { SafeUrlPipe } from './../../_pipe/safe-url.pipe';
import { EmailUnreadDialogComponent } from 'src/app/email-unread-dialog/email-unread-dialog.component';
import { MessageUiAttach } from './../../models/message-ui-attach.model';
import { FSDirDialogComponent } from 'src/app/email_fs_dir/fs-dir-dialog/fs-dir-dialog.component';
import { Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Message } from '../../models/message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from 'src/app/_http/emails.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DomainStoreService } from 'src/app/_store/domain-store.service';


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
  emailListOriginal;
  list;
  details = false;
  attachments = [];
  attachmentGIDs = [];
  attachmentNames = [];
  selectAll = true;
  downloadFileObject = [];
  action = true;
  subject;
  showInfo = false;
  body;
  quotes;
  // signature;
  locst_id = null;
  entityId;
  folderId;
  thread;
  mdId;
  readThreads = [];
  imageList = [];
  isMapped;

  constructor(
    private route: ActivatedRoute,
    public emailStore: EmailsStoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private emailServ: EmailsService,
    private location: Location,
    private detector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private domainStore: DomainStoreService,
    public globals: GlobalStoreService
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
        this.isMapped = params.isMapped === '0' ? false : true;
        this.renderMessages();
      });
  }

  renderMessages() {
    this.spinner.show();
    this.body = [];
    this.quotes = [];
    // this.signature = [];
    if (this.storeSelector === 'unread') {
      this.emailStore.getUnreadThreadData$(this.reqThreadId).subscribe(x => {
        this.thread = x;
      });
      this.emailStore.getUnreadMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
          this.emailListOriginal = x;
          this.list = x;
          for (let i = 0; i < x.length; i++) {
            this.quotes[i] = '';
            // this.signature[i] = '';
          }
        });
      this.hideBlockQuotes();
      this.spinner.hide();
    } else if (this.storeSelector === 'mapped') {
      this.isMapped = true;
      this.emailStore.getMappedThreadData$(this.reqThreadId).subscribe(x => {
        this.thread = x;
      });
      this.emailStore.getMappedMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
          this.emailListOriginal = x;
          this.list = x;
          for (let i = 0; i < x.length; i++) {
            // this.quotes[i] = '';
            // this.signature[i] = '';
          }
        });
      this.hideBlockQuotes();
      this.spinner.hide();
    } else if (this.storeSelector === 'sent') {
      this.emailStore.getSentMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
          this.emailListOriginal = this.emailList;
          this.list = x;
          for (let i = 0; i < x.length; i++) {
            // this.quotes[i] = '';
            // this.signature[i] = '';
          }
        });
      this.hideBlockQuotes();
      this.spinner.hide();
    }
  }


  draftReply(msg: Message, body, details) {
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
    const email_body = body === undefined ? '' : body;
    const email_det = details === undefined ? '' : details;
    this.globals.email_body = email_body + email_det;
    this.router.navigate(['draft/'], {
      queryParams: r_obj
    });
  }

  draftReplyToAll(msg: Message, body, details) {
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
    this.globals.email_body = body + details;
    this.router.navigate(['draft/'], {
      queryParams: ra_obj
    });
  }


  draftForward(msg: Message, body, details) {
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
    this.globals.email_body = body + details;
    this.router.navigate(['draft/'], {
      queryParams: ra_obj
    });
  }

  async fileAction(id, msgId, attachments, file?) {
    const that = this;
    this.attachments = [];
    this.attachmentGIDs = [];
    this.attachmentNames = [];
    this.downloadFileObject = [];

    if (file) {
      let fileDetails: MessageUiAttach = {
        attachmentGId: file.attachmentGId,
        fileName: file.fileName,
        fileTag: '0',
        fileSize: '0',
      };
      this.attachments.push(fileDetails);
      this.downloadFileObject.push([file.attachmentGId, file.fileName]);
    } else {
      if (id === 3) {
        this.selectAll = !this.selectAll;
        attachments.forEach(att => {
          att.isChecked = this.selectAll === false ? true : false;
          if (att.isChecked === true) {
            let fileDetails: MessageUiAttach = {
              attachmentGId: att.attachmentGId,
              fileName: att.fileName,
              fileTag: '0',
              fileSize: '0',
            };
            this.attachments.push(fileDetails);
          } else {
            this.attachments = [];
            this.attachmentGIDs = [];
            this.attachmentNames = [];
          }
        });
      } else {
        const attachments_filtered = attachments.filter(x => x.isChecked === true);
        attachments_filtered.forEach(att => {
          let fileDetails: MessageUiAttach = {
            attachmentGId: att.attachmentGId,
            fileName: att.fileName,
            fileTag: '0',
            fileSize: '0',
          };
          this.attachments.push(fileDetails);
          this.downloadFileObject.push([att.attachmentGId, att.fileName]);
        });
      }
    }

    if (id === 1) {
      this.spinner.show();
      if (this.downloadFileObject.length > 0) {
        this.emailServ.downloadLocal(msgId, this.downloadFileObject).then(function (value) {
          that.spinner.hide();
        });
      } else {
        alert('Please Select files to download!');
        this.spinner.hide();
        return;
      }
    } else if (id === 2) {
      this.spinner.show();
      const that = this;
      await this.emailStore.MessageAttch_RequestFSMapping(this.reqThreadId).then(success => {
        that.spinner.hide();
        const modalRef = that.modalService.open(
          FSDirDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        let fsTags;
        this.domainStore.fsTags$.subscribe(x => {
          fsTags = x;
        });
        modalRef.componentInstance.storeSelector = that.storeSelector; // should be the id
        modalRef.componentInstance.msgId = msgId;
        modalRef.componentInstance.attachments = that.attachments;
        modalRef.componentInstance.attachmentGIds = that.attachmentGIDs;
        modalRef.componentInstance.attachmentNames = that.attachmentNames;
        modalRef.componentInstance.reqThreadId = that.reqThreadId;
        modalRef.componentInstance.fsTags = fsTags;
        modalRef.componentInstance.uploadType = 'email_attachment';

      });

    }
  }

  expandAll(flag) {
    const that = this;
    this.action = !this.action;
    this.readThreads = [];
    if (flag === 1) {
      this.emailList.forEach(x => {
        x.isOpen = true;
        if (x.isUnread === true) {
          this.readThreads.push(x.msgid);
        }
      });
    } else {
      this.emailList.forEach(x => {
        x.isOpen = false;
      });
    }
    if (this.readThreads.length > 0) {
      this.emailStore.updateMessageStatus(this.storeSelector, this.reqThreadId, this.readThreads).then(function (value) {
        if (value === '200') {
          that.emailList.forEach(x => {
            x.isUnread = false;
          });
          that.detector.detectChanges();
        }
      });
    }
  }

  getPreview(msgId, file) {
    const that = this;
    this.spinner.show();
    this.emailServ.previewLocal(msgId, file.attachmentGId, file.fileName).then(function (value) {
      that.spinner.hide();
    });
  }

  async selectFolderForUpload(id, msgId) {
    this.getPrint(id);
    const email = document.getElementById(id);
    this.spinner.show();
    const that = this;
    await this.emailStore.MessageAttch_RequestFSMapping(this.reqThreadId).then(function (value) {
      that.spinner.hide();
      // that.mdId = value;
    });
    // let folderHeirarchy;
    // this.emailStore.getFolderList$.subscribe(x => {
    //   folderHeirarchy = x;
    // });
    const modalRef = this.modalService.open(
      FSDirDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.storeSelector = 'view'; // should be the id
    // modalRef.componentInstance.folderHierarchy = folderHeirarchy;
    modalRef.componentInstance.msgId = msgId;
    modalRef.componentInstance.attachments = this.attachments;
    modalRef.componentInstance.attachmentGIds = this.attachmentGIDs;
    modalRef.componentInstance.attachmentNames = this.attachmentNames;
    modalRef.componentInstance.reqThreadId = this.reqThreadId;
    modalRef.componentInstance.uploadType = 'email_body';
    modalRef.componentInstance.response.subscribe((x) => {
      this.uploadToFileServer(id, msgId, email, x[0], x[1], x[2], x[3], x[4]);
    });
  }


  uploadToFileServer(id, msgId, email, entityId, qlevel, file, mdId, fileTag) {
    const that = this;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('keyD', mdId);
    formData.append('keyQ', (Number(qlevel) + 1).toString());
    formData.append('keyPF', entityId);
    formData.append('keyTag', fileTag);
    this.spinner.show();
    this.detector.detectChanges();
    this.emailServ.uploadPDF(formData).then(function (value) {
      alert('Upload Successfully done!');
      that.spinner.hide();
    });
    // document.getElementById('footer_button').style.visibility = 'visible';
  }

  getPrint(id) {
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
    // if (this.quotes !== '') {
    //   document.getElementById('footer_button').style.visibility = 'visible';
    // }
  }

  OnClick_Map() {
    const modalRef = this.modalService.open(
      EmailUnreadDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.mailList = [this.thread];
    modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
    modalRef.result.then((result) => {
      if (result.action === '1') {
        this.isMapped = true;
        this.detector.detectChanges();
        modalRef.close();
      }
    });
  }

  hideTillBottom(flag, idx) {
    const html = document.getElementsByTagName('p');
    for (let i = idx; i >= idx && i < html.length; i++) {
      if (flag) {
        html[i].style.display = 'block';
      } else {
        html[i].style.display = 'none';
      }
    }
  }

  expand(eml, i) {
    eml.isOpen = !eml.isOpen;
    if (eml.isOpen) {
      this.processAttachments([eml]);
    }
  }

  renderImages(eml, i) {
    eml.showFooter = !eml.showFooter;
    this.processAttachments([eml]);
  }

  processAttachments(list) {
    this.imageList = [];
    const that = this;
    const x = document.getElementsByTagName('img');
    list.forEach(email => {
      email.attachments.forEach(att => {
        const fileExtn = att.fileName.split('.');
        if (fileExtn[1].toLowerCase().includes('png') || fileExtn[1].toLowerCase().includes('jpg') ||
          fileExtn[1].toLowerCase().includes('jpeg') || fileExtn[1].toLowerCase().includes('gif')) {
          this.emailServ.restoreEmailBodyImages(email.msgid, att.attachmentGId, att.fileName).then(function (blobUrl) {
            for (let i = 0; i < x.length; i++) {
              if (x[i].src.includes(att.fileName)) {
                x[i].setAttribute('src', blobUrl.toString());
              }
            }
            that.imageList.push(blobUrl);
          });
        }
      });
    });
    this.detector.detectChanges();
  }

  hideBlockQuotes() {
    // this.emailList.forEach(eml => {
    //   eml.isOpen = !eml.isOpen;
    //   eml.showFooter = false;
    //   if (eml.isOpen) {
    //     this.processAttachments([eml]);
    //   }
    // });
    // this.detector.detectChanges();
    this.emailListOriginal = this.list;
    this.emailListOriginal[0].isOpen = !this.emailListOriginal[0].isOpen;
    this.emailListOriginal[0].showAttachments = !this.emailListOriginal[0].showAttachments;
    this.emailListOriginal[0].showFooter = !this.emailListOriginal[0].showFooter;
    for (let i = 0; i < this.emailListOriginal.length; i++) {
      // tslint:disable-next-line: max-line-length
      if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')) {
        this.quotes[i] = '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[1]);
        this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[0];
        // if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=wordsection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=WordSection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
        //   this.signature[i] = '<div class="container-fluid"' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div class="container-fluid"')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div class="container-fluid"')[0];
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
        //   this.signature[i] = '<div style="font-size:small">' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div style="font-size:small">')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div style="font-size:small">')[0];
        // }
      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="gmail_quote">')) {
        this.quotes[i] = '<div class="gmail_quote">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div class="gmail_quote">')[1]);
        this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div class="gmail_quote">')[0];
        // if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=wordsection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=WordSection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
        //   this.signature[i] = '<div class="container-fluid"' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div class="container-fluid"')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div class="container-fluid"')[0];
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
        //   this.signature[i] = '<div style="font-size:small">' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div style="font-size:small">')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div style="font-size:small">')[0];
        // }
      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<blockquote')) {
        this.quotes[i] = '<blockquote' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<blockquote')[1]);
        this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<blockquote')[0];
        // if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=wordsection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=WordSection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
        //   this.signature[i] = '<div class="container-fluid"' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div class="container-fluid"')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div class="container-fluid"')[0];
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
        //   this.signature[i] = '<div style="font-size:small">' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div style="font-size:small">')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div style="font-size:small">')[0];
        // }

      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div id="divSignatureLine">')) {
        this.quotes[i] = '<div id="divSignatureLine">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div id="divSignatureLine"')[1]);
        this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div id="divSignatureLine">')[0];
        // if (this.emailListOriginal[i].body.trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=wordsection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')) {
        //   this.signature[i] = '<div class=WordSection1>' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
        //   this.signature[i] = '<div class="container-fluid"' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div class="container-fluid"')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div class="container-fluid"')[0];
        // } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
        //   this.signature[i] = '<div style="font-size:small">' +
        //     (this.emailListOriginal[i].body.toLowerCase().trim()
        //       .split('<div style="font-size:small">')[1]);
        //   this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        //     '<div style="font-size:small">')[0];
        // }
      }


      else {
        this.emailList[i].body = this.emailListOriginal[i].body;
        this.quotes[i] = '';
        // this.signature[i] = '';
      }
      this.readThreads = [];
      if (this.emailList[i].isUnread === true) {
        this.readThreads.push(this.emailList[i].msgid);
        const that = this;
        this.emailStore.updateMessageStatus(this.storeSelector, this.reqThreadId, this.readThreads).then(function (value) {
          if (value === '200') {
            that.emailList[i].isUnread = false;
          }
        });
      }
    }
    this.emailList = this.emailListOriginal;
  }

  // showConfirmDialog(msg) {
  //   // let data = {
  //   //   GThreadId: this.reqThreadId,
  //   //   msgId: msgid,
  //   //   refValId: '',
  //   // };
  //   const modalRef = this.modalService.open(
  //     ConfirmDialogComponent,
  //     {size: 'lg', backdrop: 'static', keyboard: false}
  //   );
  //   modalRef.componentInstance.thre
  // }

  goBack() {
    this.location.back();
  }
}
