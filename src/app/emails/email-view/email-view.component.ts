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
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { Location } from '@angular/common';


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
  signature;
  locst_id = null;
  entityId;
  folderId;
  thread;
  mdId;

  constructor(
    private route: ActivatedRoute,
    public emailStore: EmailsStoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private emailServ: EmailsService,
    private location: Location,
    private detector: ChangeDetectorRef
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
    this.body = [];
    this.quotes = [];
    this.signature = [];
    if (this.storeSelector === 'unread') {
      this.emailStore.getUnreadThreadData$(this.reqThreadId).subscribe(x =>{
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
            this.signature[i] = '';
          }
        });
        this.hideBlockQuotes();
      this.spinner.hide();
    } else if (this.storeSelector === 'mapped') {
      this.emailStore.getMappedThreadData$(this.reqThreadId).subscribe(x => {
        this.thread = x;
      });
      this.emailStore.getMappedMsgList$(this.reqThreadId)
        .pipe(
          map(msgs => msgs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        ).subscribe(x => {
          this.emailList = x;
          this.emailListOriginal = x;
          console.log(this.emailListOriginal);
          for (let i = 0; i < x.length; i++) {
            this.quotes[i] = '';
            this.signature[i] = '';
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
          for (let i = 0; i < x.length; i++) {
            this.quotes[i] = '';
            this.signature[i] = '';
          }
        });
        this.hideBlockQuotes();
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
        fileSize: '0',
      }
      this.attachments.push(fileDetails);
      this.downloadFileObject.push([file.attachmentGId, file.fileName]);
    } else {
      if (id === 3) {
        this.selectAll = !this.selectAll;
        attachments.forEach(att => {
          att.isChecked = this.selectAll === false ? true : false;
          if (att.isChecked === true) {
            let fileDetails: MessageUiAttach = {
              attachmentGId: file.attachmentGId,
              fileName: file.fileName,
              fileSize: '0',
            }
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
            fileSize: '0',
          }
          this.attachments.push(fileDetails);
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
      const that = this;
      await this.emailStore.MessageAttch_RequestFSDir(this.reqThreadId).then( function(value) {
        that.spinner.hide();
        that.mdId = value;
        const modalRef = that.modalService.open(
          FSDirDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        let folderHeirarchy;
        that.emailStore.getFolderList$.subscribe(x => {
          folderHeirarchy = x;
        });
        modalRef.componentInstance.storeSelector = that.storeSelector; // should be the id
        modalRef.componentInstance.folderHierarchy = folderHeirarchy;
        modalRef.componentInstance.msgId = msgId;
        modalRef.componentInstance.attachments = that.attachments;
        modalRef.componentInstance.attachmentGIds = that.attachmentGIDs;
        modalRef.componentInstance.attachmentNames = that.attachmentNames;
        modalRef.componentInstance.reqThreadId = that.reqThreadId;
        modalRef.componentInstance.uploadType = 'email_attachment';

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

  getPreview(msgId, file) {
    const that = this;
    this.spinner.show();
    this.emailServ.previewLocal(msgId, file.attachmentGId, file.fileName).then(function (value) {
      that.spinner.hide();
    });
  }

  async selectFolderForUpload(id, msgId) {

    alert('Feature Unavailable');
    return;

    const email = document.getElementById(id);
    this.spinner.show();
    const that = this;
    let folderHeirarchy;
    await this.emailStore.MessageAttch_RequestFSDir(this.reqThreadId).then(function (value) {
      that.spinner.hide();
      that.mdId = value;
    });
    this.emailStore.getFolderList$.subscribe(x => {
      folderHeirarchy = x;
    });
    const modalRef = this.modalService.open(
      FSDirDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
    modalRef.componentInstance.folderHierarchy = folderHeirarchy;
    modalRef.componentInstance.msgId = msgId;
    modalRef.componentInstance.attachments = this.attachments;
    modalRef.componentInstance.attachmentGIds = this.attachmentGIDs;
    modalRef.componentInstance.attachmentNames = this.attachmentNames;
    modalRef.componentInstance.reqThreadId = this.reqThreadId;
    modalRef.componentInstance.uploadType = 'email_body';
    modalRef.componentInstance.response.subscribe((x) => {
      this.uploadToFileServer(id, msgId, email, x[0], x[1], this.mdId);
    });
  }


  uploadToFileServer(id, msgId, email, entityId, qlevel, mdId) {
    // document.getElementById('footer_button').style.visibility = 'hidden';
    html2canvas(email).then(canvas => {
      let imgWidth = 210;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let imgData = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm');
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      //UPLOAD TO FS
      const file = pdf.output('blob');
      const formData: FormData = new FormData();
      formData.append('file', file, 'abc.pdf');
      formData.append('keyD', mdId);
      formData.append('keyQ', qlevel);
      formData.append('keyPF', entityId);
      formData.forEach(x =>{
        console.log(x);
      });
      // this.emailServ.uploadPDF(formData).then(function (value) {
      //   alert('Upload Successfully done!');
      //   pdf.save('Email.pdf');
      // });
      // document.getElementById('footer_button').style.visibility = 'visible';
    });
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
    if (this.quotes !== '') {
      document.getElementById('footer_button').style.visibility = 'visible';
    }
  }

  OnClick_Map() {
    console.log(this.thread);
    const modalRef = this.modalService.open(
      EmailUnreadDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.mailList = [this.thread];
    modalRef.componentInstance.storeSelector = this.storeSelector; // should be the id
    modalRef.result.then((result) => {
      if (result.action === '1') {
        modalRef.close();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  hideBlockQuotes() {
    for (let i = 0; i < this.emailListOriginal.length; i++) {
      if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')) {
        this.quotes[i] = '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[1]);
        this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[0];
          if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=wordsection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=WordSection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
            this.signature[i] = '<div class="container-fluid"' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div class="container-fluid"')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div class="container-fluid"')[0];
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
            this.signature[i] = '<div style="font-size:small">' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div style="font-size:small">')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div style="font-size:small">')[0];
          }
      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="gmail_quote">')) {
        this.quotes[i] = '<div class="gmail_quote">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div class="gmail_quote">')[1]);
        this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div class="gmail_quote">')[0];
          if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=wordsection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=WordSection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
            this.signature[i] = '<div class="container-fluid"' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div class="container-fluid"')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div class="container-fluid"')[0];
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
            this.signature[i] = '<div style="font-size:small">' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div style="font-size:small">')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div style="font-size:small">')[0];
          }
      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<blockquote')) {
        this.quotes[i] = '<blockquote' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<blockquote')[1]);
        this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<blockquote')[0];
          if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=wordsection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=WordSection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
            this.signature[i] = '<div class="container-fluid"' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div class="container-fluid"')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div class="container-fluid"')[0];
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
            this.signature[i] = '<div style="font-size:small">' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div style="font-size:small">')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div style="font-size:small">')[0];
          }

      }


      else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div id="divSignatureLine">')) {
        this.quotes[i] = '<div id="divSignatureLine">' +
          (this.emailListOriginal[i].body.toLowerCase().trim()
            .split('<div id="divSignatureLine"')[1]);
        this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
          '<div id="divSignatureLine">')[0];
          if (this.emailListOriginal[i].body.trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=wordsection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')) {
            console.log('Enter');
            this.signature[i] = '<div class=WordSection1>' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
          } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
            this.signature[i] = '<div class="container-fluid"' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div class="container-fluid"')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div class="container-fluid"')[0];
          }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
            this.signature[i] = '<div style="font-size:small">' +
              (this.emailListOriginal[i].body.toLowerCase().trim()
                .split('<div style="font-size:small">')[1]);
            this.emailListOriginal[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
              '<div style="font-size:small">')[0];
          }
      }


      else {
        this.emailListOriginal[i].body = this.emailListOriginal[i].body;
        this.quotes[i] = '';
        this.signature[i] = '';
      }
      console.log('BODY',this.emailListOriginal[i].body);
    }
    this.emailList = this.emailListOriginal;
    this.detector.detectChanges();
  }

  expand(eml, i) {
    eml.isOpen = !eml.isOpen;
    this.emailListOriginal = this.list;
    // eml.isOpen = bool;
    if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')) {
      this.quotes[i] = '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">' +
        (this.emailListOriginal[i].body.toLowerCase().trim()
          .split('<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[1]);
      this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        '<div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">')[0];
        if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=wordsection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=WordSection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
          this.signature[i] = '<div class="container-fluid"' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div class="container-fluid"')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div class="container-fluid"')[0];
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
          this.signature[i] = '<div style="font-size:small">' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div style="font-size:small">')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div style="font-size:small">')[0];
        }
    }


    else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="gmail_quote">')) {
      this.quotes[i] = '<div class="gmail_quote">' +
        (this.emailListOriginal[i].body.toLowerCase().trim()
          .split('<div class="gmail_quote">')[1]);
      this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        '<div class="gmail_quote">')[0];
        if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=wordsection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=WordSection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
          this.signature[i] = '<div class="container-fluid"' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div class="container-fluid"')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div class="container-fluid"')[0];
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
          this.signature[i] = '<div style="font-size:small">' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div style="font-size:small">')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div style="font-size:small">')[0];
        }
    }


    else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<blockquote')) {
      this.quotes[i] = '<blockquote' +
        (this.emailListOriginal[i].body.toLowerCase().trim()
          .split('<blockquote')[1]);
      this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        '<blockquote')[0];
        if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=wordsection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=WordSection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class="MsoNormal"><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
          this.signature[i] = '<div class="container-fluid"' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div class="container-fluid"')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div class="container-fluid"')[0];
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
          this.signature[i] = '<div style="font-size:small">' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div style="font-size:small">')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div style="font-size:small">')[0];
        }

    }


    else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div id="divSignatureLine">')) {
      this.quotes[i] = '<div id="divSignatureLine">' +
        (this.emailListOriginal[i].body.toLowerCase().trim()
          .split('<div id="divSignatureLine"')[1]);
      this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
        '<div id="divSignatureLine">')[0];
        if (this.emailListOriginal[i].body.trim().includes('<p class=msonormal><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=wordsection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class=msonormal><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class=msonormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')) {
          console.log('Enter');
          this.signature[i] = '<div class=WordSection1>' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<p class=MsoNormal><o:p>&nbsp;</o:p></p>')[0] + '</div>';
        } else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div class="container-fluid"')) {
          this.signature[i] = '<div class="container-fluid"' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div class="container-fluid"')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div class="container-fluid"')[0];
        }else if (this.emailListOriginal[i].body.toLowerCase().trim().includes('<div style="font-size:small">')) {
          this.signature[i] = '<div style="font-size:small">' +
            (this.emailListOriginal[i].body.toLowerCase().trim()
              .split('<div style="font-size:small">')[1]);
          this.emailList[i].body = this.emailListOriginal[i].body.toLowerCase().trim().split(
            '<div style="font-size:small">')[0];
        }
    }


    else {
      this.emailList[i].body = this.emailListOriginal[i].body;
      this.quotes[i] = '';
      this.signature[i] = '';
    }
    console.log('BODY',this.emailListOriginal[i].body);
  }
}
