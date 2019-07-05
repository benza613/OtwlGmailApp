import { FsOrderFiles } from './../../models/fs-order-files';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { LocalStorageService } from 'src/app/_util/local-storage.service';
import { environment } from 'src/environments/environment.prod';

const URL = environment.url.uploadsGA;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  addEmail = '';

  msgPacket = {
    to: [],
    cc: [],
    bcc: [],
    subject: '',
  };

  public EditorTools: object = {
    type: 'MultiRow',
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'Print', '|', 'FullScreen']
  };

  msgAddrList = [
    { emailId: 'benito.alvares@gmail.com' },
    { emailId: '<it3@oceantransworld.com>' },
    { emailId: 'pritee@oceantransworld.com' },
    { emailId: 'nivedita@oceantransworld.com' },
    { emailId: 'ganesh@oceantransworld.com' },
    { emailId: 'Sushant <it5@oceantransworld.com>' },
  ];

  _TOKEN_POSSESION = "";

  _inlineAttachments = [];
  _inlineAttachB64 = [];
  // tslint:disable-next-line:max-line-length
  public EditorValue = `Dear Sir/ Madam, <br/> <br/>`;

  _reqThreadID = '';
  _reqMessageID = '';
  _reqStoreSelector = '';
  _reqActionType = '';

  _reqOrderID = '';

  _isOrdersComplete = false;
  orderDetails = [];
  delOrderDetails = [];
  senderName;
  senderDesgn;
  senderMobile;
  senderEmail;
  signatureHtml = '<div></div>';
  footerHtml;
  orderFilesSize;
  uploadFilesSize = 0;
  constructor(
    private route: ActivatedRoute,
    private emailStore: EmailsStoreService,
    private detector: ChangeDetectorRef,
    private locStgService: LocalStorageService
  ) { }

  ngOnInit() {
    const emlData = {};

    this._TOKEN_POSSESION = this.randomTokenGenerator(6) + '-' + this.randomTokenGenerator(6);


    // get query string if exists
    // if q->unread/mapped & i->exists
    //  initfromStore
    // TODO else initfromLocalStorage if present

    //angular number pipe
    //https://github.com/angular/angular/blob/1608d91728af707d9740756a80e78cfb1148dd5a/modules/%40angular/common/src/pipes/number_pipe.ts#L82

  this.uploader.onAfterAddingFile = (fileItem) => {
    this.uploadFilesSize += fileItem.file.size;
    this.detector.detectChanges();
  };

    // this.uploader.queue.forEach(x => {
    //   console.log('FileSize', x.file.size);
    //   this.uploadFilesSize += x.file.size;
    // });
    var that = this;

    this.emailStore.getUserMailInfo().then(function (value) {
      console.log(value);
      that.senderName = value['d'].userFullName;
      that.senderEmail = value['d'].userEmailID;
      that.senderMobile = value['d'].userUserContactNumber;
      that.senderDesgn = value['d'].userDesignation;
      that.fillSignatureTemplate(that.senderName, that.senderDesgn, that.senderMobile, that.senderEmail);
    });

    this.route.queryParams
      .subscribe(params => {


        //first check if storeSelector is undefined
        //then check if attachment order is requested 
        if (params.q == undefined && params.order != undefined) {

          this._reqOrderID = params.order;

          this.emailStore.updateAttachmentOrderDetails(this._reqOrderID).then(function (value) {
            that.orderFilesSize = 0;
            let size = 0;
            that.orderDetails = [...that.orderDetails, value][0];
            that.orderDetails.forEach(x => {
              if (x.flSize.split(' ')[1] === 'kB') {
                size += (Number(x.flSize.split(' ')[0]) * 1024);
              } else {
                size += (Number(x.flSize.split(' ')[0]) * 1048576);
              }
            });
            if (size <= 999999) {
              that.orderFilesSize = String((size / 1024).toFixed(2)) + ' KB';
            } else {
              that.orderFilesSize = String((size / 1048576).toFixed(2)) + ' MB';
            }

            console.log(that.orderDetails);
            that._isOrdersComplete = true;
            that.detector.detectChanges();
          });
        } else if (params.q !== undefined && params.mid !== undefined && params.tid !== undefined) {
          this._reqThreadID = params.tid;
          this._reqMessageID = params.mid;
          this._reqStoreSelector = params.q;
          this._reqActionType = params.a;

          const x = this.emailStore.fetchMessage(this._reqStoreSelector, this._reqThreadID, this._reqMessageID);
          if (x.msgs !== undefined && x.msgs.length > 0) {
            this.recycleGmailAddressFields(x.msgs);
            this.msgPacket.subject = x.subject;
          }
        }

        if (params.locst_id !== undefined) {
          console.log("params.locst_id", params.locst_id);
          var localToken = params.locst_id;
          if (localToken) {
            const emlData = that.locStgService.fetchMessagePacket(localToken);
            console.log(emlData);
            that.initMessagePacket_LocalStorage(emlData);
          }
        }
      });

    this.uploader.onProgressAll = (progress: any) => this.detector.detectChanges();
    //this.uploader.options.removeAfterUpload = true;

    this.uploader.options.isHTML5 = true;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      
    }

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      item.remove();
    }

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('err', item.file.name);
    }

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      //Use this action to append a token of possesion that will be used AFTER all files 
      //are uploaded inorder to send mail

      form.append('tokenHolder', this._TOKEN_POSSESION);
      console.log(fileItem);
    }

    this.uploader.onCompleteAll = () => {

      this.uploader.progress = 0;
      this.detector.detectChanges();

      if (this.uploader.queue.length > 0) {
        let x = confirm("Few Files Didnt Upload. Do you want to proceed?");
        if (!x) {
          alert('Mail Not sent');
          return;
        }
      }

      this.base64InlineAttachmentsToBody().then(
        (data) => {
          // then send mail
          this.emailStore.sendNewEmail(this.msgPacket, data + this.signatureHtml + this.footerHtml,
            this._inlineAttachB64, this._reqActionType, this._reqStoreSelector,
            this._reqMessageID, this._TOKEN_POSSESION, this.orderDetails);

        },
        (err) => {
          console.log('Error Occured while streamlining inline images', err);
          alert('Error OCCURRED: UI-SND-ML-01');

        });


    }
  }

  initMessagePacket_LocalStorage(emlData) {
    if (emlData.subject !== undefined) {
      this.msgPacket.subject = emlData.subject;
    }

    if (emlData.body !== undefined) {
      this.EditorValue = emlData.body;
    }

    if (emlData.to !== undefined) {
      emlData.to.forEach(element => {
        if (element !== undefined && element !== '') {
          this.msgAddrList.push({ emailId: element });
          this.msgPacket.to.push({ emailId: element });
        }
      });
    }

    if (emlData.cc !== undefined) {
      emlData.cc.forEach(element => {
        if (element !== undefined && element !== '') {
          this.msgAddrList.push({ emailId: element });
          this.msgPacket.cc.push({ emailId: element });
        }
      });
    }

    if (emlData.bcc !== undefined) {
      emlData.bcc.forEach(element => {
        if (element !== undefined && element !== '') {
          this.msgAddrList.push({ emailId: element });
          this.msgPacket.bcc.push({ emailId: element });
        }
      });
    }

  }


  actionCompleted(ev: any) {
    console.log(ev);

    if (ev.requestType === 'Image') {

      ev.elements.forEach(element => {

        if (element.nodeName === 'IMG') {
          this._inlineAttachments.push({
            src: element.src,
            alt: element.alt
          });

        }
      });

    }
  }

  onClick_SendMail() {
    console.log(this.msgPacket);
    console.log(this.uploader);
    this.uploader.uploadAll();
    // process inline attachments

  }

  private base64InlineAttachmentsToBody() {
    let msgBodyCopy = this.EditorValue;
    const self = this;

    return new Promise((reslv, rej) => {

      if (this._inlineAttachments.length === 0) {
        reslv(msgBodyCopy);
      }

      this._inlineAttachments.forEach((img, imgCounter) => {

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            // (reader.result as string)
            const cid = self.randomCidGenerator(11);
            const newstr = msgBodyCopy.replace(img.src, 'cid:' + cid);
            msgBodyCopy = newstr;

            self._inlineAttachB64.push({
              cid: cid,
              filename: img.alt,
              dataUrl: (reader.result as string).split(',')[1]
            });

            if (imgCounter === self._inlineAttachments.length - 1) {
              reslv(msgBodyCopy);
            }
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', img.src);
        xhr.responseType = 'blob';
        xhr.send();

      });

    });
  }


  randomCidGenerator(lengthx) {
    let text = 'otwl_-_-_';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < lengthx; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  randomTokenGenerator(lengthx) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < lengthx; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  fillSignatureTemplate(senderName, senderDesgn, senderMobile, senderEmail) {
    this.signatureHtml = `<div class="container-fluid" style="margin-top: 5px;text-align: right;font-size: 12px;">
    <div style="text-align: right;">
      <span style="font-family: Arial, Helvetica, sans-serif;">
        <span style="color: rgb(47, 84, 150); text-decoration: inherit;">
          <strong><em>` + senderName + `&nbsp;</em></strong>
        </span>
      </span>
    </div>
    <div style="text-align: right;"><span style="font-family: Arial, Helvetica, sans-serif;"><span
          style="color: rgb(47, 84, 150); text-decoration: inherit;"><strong><em>` + senderDesgn + `&nbsp;</em></strong></span></span>
      <div style="text-align: right;"><br></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">“Silver Astra” B-503/A, J. B. Nagar,&nbsp;</span></span>
      </div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Andheri (E) Mumbai- 400 099.&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Board : +91 22 62839000-99 (100
            lines)&nbsp;</span></span>
      </div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Direct : +91 22 62839034&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Mobile : ` + senderMobile + `&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Fax : +91 11 22 2830 4386&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">E-Mail : ` + senderEmail + `&nbsp;</span></span></div>
      <div style="text-align: right;"><span style="color: rgb(47, 84, 150); text-decoration: inherit;"><span
            style="font-family: Arial, Helvetica, sans-serif;">Web : www.oceantransworld.com</span></span></div>

    </div>
  </div>`;
    this.footerHtml = `
        <div style="text-align: right;">
            <table style="opacity:0.75;clear:both;margin:25px auto" width="100%" cellspacing="0" cellpadding="5"
              bgcolor="#fafafa" align="center">
              <tbody>
                <tr>
                  <td align="center">
                    <font size="1" face="Arial, Helvetica, sans-serif" color="#333333">
                      <span style="font-size:11px">
                        This email was generated & sent by OTWL MAILER. ref:_19950115 </span>
                    </font>
                  </td>
                </tr>
              </tbody>
            </table>
          < /div>`;
    console.log(this.signatureHtml + this.footerHtml);
  }

  private recycleGmailAddressFields(msgs) {

    msgs[0].msgBcc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'r') {
          this.msgPacket.bcc.push({ emailId: element });
        }
      }
    });

    msgs[0].msgCc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'r') {
          this.msgPacket.cc.push({ emailId: element });
        }
      }
    });

    msgs[0].from.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'r') {
          this.msgPacket.to.push({ emailId: element });
        }
      }
    });

    msgs[0].msgTo.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
      }
    });

  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    //https://github.com/valor-software/ng2-file-upload/blob/development/src/file-upload/file-uploader.class.ts
  }

  addAddr(event) {
    const idx = this.msgAddrList.findIndex(obj => obj.emailId === event.emailId);
    if (idx === -1) {
      this.msgAddrList = [...this.msgAddrList, event.emailId];
    }
  }

  editOrderDetails(id, order) {
    if (id === 1) {
      const idx = this.orderDetails.indexOf(order);
      this.orderDetails.splice(idx, 1);
      this.delOrderDetails.push(order);
      this.detector.detectChanges();
    } else {
      const idx = this.delOrderDetails.indexOf(order);
      this.delOrderDetails.splice(idx, 1);
      this.orderDetails.push(order);
      this.detector.detectChanges();
    }
  }
}
