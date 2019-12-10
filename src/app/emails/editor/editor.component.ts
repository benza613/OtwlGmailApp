import { GlobalStoreService } from './../../_store/global-store.service';
import { DomainStoreService } from './../../_store/domain-store.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { LocalStorageService } from 'src/app/_util/local-storage.service';
import { environment } from 'src/environments/environment.prod';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FSFilesDialogComponent } from 'src/app/email_fs_files/fsfiles-dialog/fsfiles-dialog.component';
import { Location } from '@angular/common';

const URL = environment.url.uploadsGA;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  addEmail = '';
  ccBcc = false;

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


  msgAddrList = [];
  addrListCc = [];
  addrListBcc = [];

  _TOKEN_POSSESION = '';

  _inlineAttachments = [];
  _inlineAttachB64 = [];
  // tslint:disable-next-line:max-line-length
  public EditorValue = `Dear Sir/ Madam, <br/>`;

  _reqThreadID = '';
  _reqMessageID = '';
  _reqStoreSelector = '';
  _reqActionType = '';
  _isDraft = 'false';

  _reqOrderID = '';

  _isOrdersComplete = false;
  orderDetails = [];
  delOrderDetails = [];

  alacarteDetails = [];
  senderName;
  senderDesgn;
  senderMobile;
  senderEmail;
  senderLandline;
  senderWeChat;
  senderSkype;
  signatureHtml = '<div></div>';
  footerHtml;
  orderFilesSize;
  uploadFilesSize = 0;
  sendFileSize = 0;
  showUploadSize;
  addressBook;
  showEmail = false;
  draftMail;
  draftAttachments = [];
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private emailStore: EmailsStoreService,
    private detector: ChangeDetectorRef,
    private locStgService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private domainStore: DomainStoreService,
    private location: Location,
    public globals: GlobalStoreService
  ) { }

  ngOnInit() {
    const emlData = {};
    this._TOKEN_POSSESION = this.randomTokenGenerator(6) + '-' + this.randomTokenGenerator(6);

    // get query string if exists
    // if q->unread/mapped & i->exists
    //  initfromStore
    // TODO else initfromLocalStorage if present

    // angular number pipe
    // https://github.com/angular/angular/blob/1608d91728af707d9740756a80e78cfb1148dd5a/
    // modules/%40angular/common/src/pipes/number_pipe.ts#L82

    this.uploader.onAfterAddingFile = (fileItem) => {
      this.uploadFilesSize += fileItem.file.size;
      this.detector.detectChanges();
    };

    this.uploader.removeFromQueue = (fileItem) => {
      this.uploader.queue.splice(this.uploader.queue.indexOf(fileItem), 1);
      this.uploadFilesSize -= fileItem.file.size;
      this.detector.detectChanges();
    };

    // this.uploader.addToQueue = (fileItem) => {
    //   console.log('FILES', this.uploader.queue);
    // };

    const that = this;
    this.emailStore.getAddressBook();
    this.emailStore.getUserMailInfo().then(function (value) {
      that.senderName = value['d'].userFullName;
      that.senderEmail = value['d'].userEmailID;
      that.senderMobile = value['d'].userContactNumber;
      that.senderDesgn = value['d'].userDesignation;
      that.senderLandline = value['d'].userLandlineNo;
      that.senderWeChat = value['d'].userWeChat;
      that.senderSkype = value['d'].userSkype;
      that.fillSignatureTemplate(that.senderName, that.senderDesgn, that.senderMobile, that.senderEmail,
        that.senderLandline, that.senderWeChat, that.senderSkype);
      that.detector.detectChanges();
    });

    this.emailStore.addressBook$.subscribe(x => {
      this.msgAddrList = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.msgAddrList = [...this.msgAddrList, { emailId: x[ix].emailName + ' ' + '<' + x[ix].emailAddr + '>' }];
      }
      setTimeout(() => {
        if (this.msgPacket.cc.length > 0) {
          this.msgPacket.cc.forEach(x => {
          });
          this.msgPacket.cc = this.msgPacket.cc.filter(x => !x.emailId.includes(this.senderEmail));
          this.detector.detectChanges();
        }
        if (this.msgPacket.bcc.length > 0) {
          this.msgPacket.bcc.forEach(x => {
          });
          this.msgPacket.bcc = this.msgPacket.bcc.filter(x => !x.emailId.includes(this.senderEmail));
          this.detector.detectChanges();
        }
      });
    });

    this.route.queryParams
      .subscribe(params => {


        // first check if storeSelector is undefined
        // then check if attachment order is requested
        if (params.q === undefined && params.order !== undefined) {

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
            that.sendFileSize = size;
            if (size <= 999999) {
              that.orderFilesSize = String((size / 1024).toFixed(2)) + 'KB';
              that.showUploadSize = String((size / 1024).toFixed(2)) + 'KB';
            } else {
              that.orderFilesSize = String((size / 1048576).toFixed(2)) + 'MB';
              that.showUploadSize = String((size / 1048576).toFixed(2)) + 'MB';
            }
            that._isOrdersComplete = true;
            that.detector.detectChanges();
          });
        } else if (params.q !== undefined && params.mid !== undefined && params.tid !== undefined && params.q !== 'draft') {
          this._reqThreadID = params.tid;
          this._reqMessageID = params.mid;
          this._reqStoreSelector = params.q;
          this._reqActionType = params.a;

          const x = this.emailStore.fetchMessage(this._reqStoreSelector, this._reqThreadID, this._reqMessageID);
          if (x.msgs !== undefined && x.msgs.length > 0) {
            this.recycleGmailAddressFields(x.msgs);
            this.msgPacket.subject = x.subject;
          }
        } else if (params.q !== undefined && params.q === 'draft') {
          this._reqStoreSelector = params.q;
          this._reqThreadID = params.tid;
          this._reqMessageID = params.mid;
          this._isDraft = 'true';
          const x = this.emailStore.fetchMessage(this._reqStoreSelector, this._reqThreadID, this._reqMessageID);
          if (x.msgs !== undefined && x.msgs.length > 0) {
            this.recycleDraftGmailAddressFields(x.msgs);
            this.msgPacket.subject = x.subject;
            x.msgs[0]['Payload']['Parts'].forEach(att => {
              if (att.Filename !== '') {
                this.draftAttachments.push(att);
              }
            });
          }
        }

        if (params.locst_id !== undefined) {
          const localToken = params.locst_id;
          if (localToken) {
            const emlData = that.locStgService.fetchMessagePacket(localToken);
            that.initMessagePacket_LocalStorage(emlData);

            if (emlData['alacarte'] !== undefined) {
              for (let index = 0; index < emlData['alacarte'].length; index++) {
                this.alacarteDetails.push(emlData['alacarte'][index]);
              }

            }
          }
        }
      });

    this.uploader.onProgressAll = (progress: any) => this.detector.detectChanges();
    // this.uploader.options.removeAfterUpload = true;

    this.uploader.options.isHTML5 = true;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      item.remove();
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('err', item.file.name);
    };

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      // Use this action to append a token of possesion that will be used AFTER all files
      // are uploaded inorder to send mail

      form.append('tokenHolder', this._TOKEN_POSSESION);
      console.log(fileItem);
    };

    this.uploader.onCompleteAll = () => {
      const that = this;
      this.uploader.progress = 0;
      this.detector.detectChanges();

      if (this.uploader.queue.length > 0) {
        const x = confirm('Few Files Didnt Upload. Do you want to proceed?');
        if (!x) {
          alert('Mail Not sent');
          return;
        }
      }

      this.base64InlineAttachmentsToBody().then(
        (data) => {
          // then take care of custom_otwl_inliner since google blocks embedded bae64 strings

          this.base64EmbeddedAttachmentsToBody(data).then(
            (finalBody) => {
              // then send mail
              const emailList = [];
              this.msgPacket.to.forEach(x => {
                const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
                if (idx === -1) {
                  this.msgAddrList.push(x);
                }
              });
              this.msgPacket.cc.forEach(x => {
                const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
                if (idx === -1) {
                  this.msgAddrList.push(x);
                }
              });
              this.msgPacket.bcc.forEach(x => {
                const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
                if (idx === -1) {
                  this.msgAddrList.push(x);
                }
              });
              this.msgAddrList.forEach(x => {
                emailList.push(x['emailId']);
              });
              this.emailStore.sendNewEmail(this.msgPacket, finalBody + this.footerHtml,
                this._inlineAttachB64, this._reqActionType, this._reqStoreSelector,
                this._reqMessageID, this._TOKEN_POSSESION, this.orderDetails, emailList,
                this.alacarteDetails, this.globals.emailAttach, this.globals.subject, this._isDraft)
                .then(function (value) {
                  that.spinner.hide();
                  that.globals.emailAttach = null;
                  that.detector.detectChanges();
                  if (this._reqStoreSelector !== '') {
                    that.location.back();
                  }
                  that.resetData();
                });
            });
        },
        (err) => {
          console.log('Error Occured while streamlining inline images', err);
          alert('Error OCCURRED: UI-SND-ML-01');

        });


    };
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
          this.msgPacket.cc = this.msgPacket.cc.filter(x => !x.emailId.includes(this.senderEmail));
          this.detector.detectChanges();
        }
      });
    }

    if (emlData.bcc !== undefined) {
      emlData.bcc.forEach(element => {
        if (element !== undefined && element !== '') {
          this.msgAddrList.push({ emailId: element });
          this.msgPacket.bcc = this.msgPacket.bcc.filter(x => !x.emailId.includes(this.senderEmail));
          this.detector.detectChanges();
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
    this.spinner.show();
    this.detector.detectChanges();
    const that = this;
    this.msgPacket.to.forEach(x => {
      const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
      if (idx === -1) {
        this.msgAddrList.push(x);
      }
    });
    this.msgPacket.cc.forEach(x => {
      const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
      if (idx === -1) {
        this.msgAddrList.push(x);
      }
    });
    this.msgPacket.bcc.forEach(x => {
      const idx = this.msgAddrList.findIndex(y => y.emailId === x.emailId);
      if (idx === -1) {
        this.msgAddrList.push(x);
      }
    });
    if (this.msgPacket.to.length !== 0 || this.msgPacket.cc.length !== 0 || this.msgPacket.bcc.length !== 0) {
      if (this.uploader.queue.length === 0) {

        this.base64InlineAttachmentsToBody().then(
          (data) => {
            this.base64EmbeddedAttachmentsToBody(data).then(
              (finalBody) => {
                // then send mail
                const emailList = [];
                this.msgAddrList.forEach(x => {
                  emailList.push(x['emailId']);
                });
                this.emailStore.sendNewEmail(this.msgPacket, finalBody + this.footerHtml,
                  this._inlineAttachB64, this._reqActionType, this._reqStoreSelector,
                  this._reqMessageID, this._TOKEN_POSSESION, this.orderDetails, emailList,
                  this.alacarteDetails, this.globals.emailAttach, this.globals.subject, this._isDraft)
                  .then(function (value) {
                    that.spinner.hide();
                    that.detector.detectChanges();
                    that.globals.emailAttach = null;
                    that._TOKEN_POSSESION = that.randomTokenGenerator(6) + '-' + that.randomTokenGenerator(6);
                    that.resetData();
                    if (that._reqStoreSelector === 'draft') {
                      this.location.back();
                    }
                  });
              });

          },
          (err) => {
            console.log('Error Occured while streamlining inline images', err);
            alert('Error OCCURRED: UI-SND-ML-01');
            that.spinner.hide();
          });
      } else {
        // process external then inline attachments
        this.uploader.uploadAll();
      }
    } else {
      alert('Please Select atleast 1 recipient');
      this.spinner.hide();
    }

  }

  private base64InlineAttachmentsToBody() {
    let msgBodyCopy = this.EditorValue + this.signatureHtml;
    this._inlineAttachments.push(
      { src: 'assets/icons/address.png', alt: 'address.png' },
      { src: 'assets/icons/at.png', alt: 'at.png' },
      { src: 'assets/icons/icons8-skype-48.png', alt: 'icons8-skype-48.png' },
      { src: 'assets/icons/icons8-website-48.png', alt: 'icons8-website-48.png' },
      { src: 'assets/icons/logo.png', alt: 'logo.png' },
      { src: 'assets/icons/mobile.png', alt: 'mobile.png' },
      { src: 'assets/icons/icons8-weixin-48.png', alt: 'icons8-weixin-48.png' },
      { src: 'assets/icons/phone-office.png', alt: 'phone-office.png' },
      { src: 'assets/icons/phone-office2.png', alt: 'phone-office2.png' },


      { src: 'assets/certificates/mto.png', alt: 'mto.png' },
      { src: 'assets/certificates/sym.png', alt: 'sym.png' },
      { src: 'assets/certificates/wca.png', alt: 'wca.png' },
      { src: 'assets/certificates/cl.png', alt: 'cl.png' },
      { src: 'assets/certificates/iso.png', alt: 'iso.png' },
      { src: 'assets/certificates/mt.png', alt: 'mt.png' },
    );

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

  private base64EmbeddedAttachmentsToBody(msgBodyCopy) {
    const self = this;

    return new Promise((reslv, rej) => {
      let occurences = (msgBodyCopy.match(/custom_otwl_inliner/g) || []).length;

      while (occurences > 0) {

        let posInitial = msgBodyCopy.indexOf('custom_otwl_inliner');
        if (posInitial === -1) {
          break;
        }

        // <img class="custom_otwl_inliner" src="">
        posInitial -= 12;

        // check if char at this position is < ie. opening of img tag
        if (msgBodyCopy.charAt(posInitial) !== '<') {
          break;
        }

        const posFinal = msgBodyCopy.indexOf('>', posInitial);

        let posSrc = msgBodyCopy.indexOf('src', posInitial);
        posSrc += 5;

        const posSrcClosing = msgBodyCopy.indexOf('"', posSrc);

        const matchDataUrl = msgBodyCopy.substring(posSrc, posSrcClosing);
        const matchWholeImgTag = msgBodyCopy.substring(posInitial, posFinal + 1);
        const cid = self.randomCidGenerator(11);
        const newstr = msgBodyCopy.replace(matchWholeImgTag, '<img src="cid:' + cid + '" alt="' + cid + '"/>');
        msgBodyCopy = newstr;

        self._inlineAttachB64.push({
          cid: cid,
          filename: cid,
          dataUrl: matchDataUrl.split(',')[1]
        });


        occurences--;
      }

      reslv(msgBodyCopy);
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

  fillSignatureTemplate(senderName, senderDesgn, senderMobile, senderEmail, senderLandline, senderWeChat, senderSkype) {
    this.signatureHtml = `
    <table style="border: 1px solid rgb(179, 179, 179);">
  <tbody>
    <tr>
      <td colspan="3" align="center" style="margin: 0px 5px;">
        <img width="200" height="123" id="m_9218901733660170609Picture_x0020_17" src="assets/icons/logo.png"
          data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="4" style="margin: 0px 5px;">
        <span><b style="color:#03227d">` + senderName + `</b></span><br />
        <span><b style="color:#e21d24">` + senderDesgn + `</b></span><br />
        <span>
          <img width="19" height="19" src="assets/icons/mobile.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span>` + senderMobile + `</span><br />
        <span>
          <img width="19" height="19" src="assets/icons/phone-office.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span>` + senderLandline + `</span><br />
        <span>
          <img width="19" height="19" src="assets/icons/phone-office2.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span>+91-22-62839000-99 (100 lines) [<b>Board
            Line</b>]</span><br />
        <span>
          <img width="19" height="19" src="assets/icons/at.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <a href="mailto:` + senderEmail + `" target="_blank"><span style="color:blue">` + senderEmail +
            `</span></a><br />
      </td>
      <td style="vertical-align: top;padding:0px !important;" colspan="5">
        <span style="margin: 5px;">
          <img width="19" height="19" id="m_9218901733660170609Picture_x0020_2" src="assets/icons/address.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span style="margin: 5px;">B-503/A, Silver Astra, J.B.Nagar, Andheri (E), Mumbai-400099</span><br />
        <span style="margin: 5px;">
          <img width="19" height="19" id="m_9218901733660170609Picture_x0020_2" src="assets/icons/icons8-skype-48.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span>` + senderSkype + `</span><br />
        <span style="margin: 5px;">
          <img width="19" height="19" id="m_9218901733660170609Picture_x0020_2" src="assets/icons/icons8-weixin-48.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <span>` + senderWeChat + `</span><br />
        <span style="margin: 5px;">
          <img width="19" height="19" id="m_9218901733660170609Picture_x0020_2" src="assets/icons/icons8-website-48.png"
            data-image-whitelisted="" class="CToWUd">
        </span>&nbsp;
        <a href="http://www.oceantransworld.com" target="_blank"
          data-saferedirecturl="https://www.google.com/url?q=http://www.oceantransworld.com&amp;source=gmail&amp;ust=1570171363357000&amp;usg=AFQjCNHr3jnCxnkqtBvbs438ZS2jevRAig"><span
            style="font-size:9.0pt;color:blue; margin: 5px;">www.oceantransworld.com</span></a><br />
        <div style="display:flex; flex-direction: column; margin-top: 10px;">
          <span
            style="width: 100% !important;background:#1f497d;color:white; overflow: auto;display: inline-block; text-align: center;">Inbound
            | Outbound | Overland Services | Project Logistics | Custom
            Clearance</span>
          <span
            style="width: 100% !important;background:#cc0000;color: white;display: inline-block;text-align: center;">Branches
            : Delhi |
            Rajsthan | Gujrat | Bangalore | Chennnai</span>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <img border="0" width="72" height="60" id="m_9218901733660170609Picture_x0020_11"
          src="assets/certificates/wca.png" alt="sigpic1_1.png" data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="2" align="center">
        <img border="0" width="72" height="43" id="m_9218901733660170609Picture_x0020_19"
          src="assets/certificates/cl.png" alt="sigpic2.png" data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="2" align="center">
        <img border="0" width="89" height="43" id="m_9218901733660170609Picture_x0020_23"
          src="assets/certificates/mt.png" alt="sigpic6.png" data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="2" align="center">
        <img border="0" width="72" height="43" id="m_9218901733660170609Picture_x0020_26"
          src="assets/certificates/mto.png" alt="sigpic3.png" data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="2" align="center">
        <img border="0" width="72" height="43" id="m_9218901733660170609Picture_x0020_14"
          src="assets/certificates/iso.png" alt="sigpic4.png" data-image-whitelisted="" class="CToWUd">
      </td>
      <td colspan="2" align="center">
        <img border="0" width="59" height="36" id="m_9218901733660170609Picture_x0020_15"
          src="assets/certificates/sym.png" alt="sigpic5.png" data-image-whitelisted="" class="CToWUd">
      </td>
    </tr>
    <tr>
      <td colspan="12">
        <b><span style="font-size:8.0pt;color:#03227d">Disclaimer:</span></b><span
          style="font-size:8.0pt;color:gray">&nbsp; The contents, attachments of and information provided in this
          E-mail are privileged and confidential material of Ocean Transworld Logistics Pvt. Ltd. and is sent to the
          intended&nbsp;&nbsp; addressee(s). The said&nbsp; contents should not be disclosed to, used by or copied in
          any manner by anyone else. In case you are not the desired addressee, you should delete
          this message and/or re-direct it to the sender. The attachments to this email have been scanned by an
          Antivirus trusted by Ocean Transworld Logistics Pvt. Ltd. However, the recipient should ensure that it is
          virus free.</span>
      </td>
    </tr>
  </tbody>
</table>`;
    this.footerHtml = `
        <div style="text-align: left;">
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
            </table>`;
  }

  private recycleGmailAddressFields(msgs) {

    msgs[0].msgBcc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'ra') {
          this.msgPacket.bcc.push({ emailId: element });
        }
      }
    });

    msgs[0].msgCc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'ra') {
          this.msgPacket.cc.push({ emailId: element });
        }
      }
    });

    msgs[0].from.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'ra' || this._reqActionType === 'r') {
          this.msgPacket.to.push({ emailId: element });

        }
      }
    });

    // msgs[0].msgTo.split(',').forEach(element => {
    //   if (element !== undefined && element !== '') {
    //     this.msgAddrList.push({ emailId: element });
    //     if (this._reqActionType === 'ra') {
    //       this.msgPacket.cc.push({ emailId: element });
    //     }
    //   }
    // });

  }

  private recycleDraftGmailAddressFields(msgs) {
    msgs[0].Payload.Headers.forEach(x => {
      if (x.Name === 'To') {
        x.Value.split(',').forEach(element => {
          if (element !== undefined && element !== '') {
            this.msgAddrList.push({ emailId: element });
            this.msgPacket.to.push({ emailId: element });
          }
        });
      }
    });
    this.EditorValue = msgs[0].Snippet;
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    // https://github.com/valor-software/ng2-file-upload/blob/development/src/file-upload/file-uploader.class.ts
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
      if (this.orderDetails[idx].flSize.split(' ')[1] === 'kB') {
        this.sendFileSize -= (Number(this.orderDetails[idx].flSize.split(' ')[0]) * 1024);
      } else {
        this.sendFileSize -= (Number(this.orderDetails[idx].flSize.split(' ')[0]) * 1048576);
      }

      if (this.sendFileSize <= 999999) {
        this.showUploadSize = String((this.sendFileSize / 1024).toFixed(2)) + 'KB';
      } else {
        this.showUploadSize = String((this.sendFileSize / 1048576).toFixed(2)) + 'MB';
      }
      this.orderDetails.splice(idx, 1);
      this.delOrderDetails.push(order);
      this.detector.detectChanges();
    } else {
      const idx = this.delOrderDetails.indexOf(order);
      if (this.delOrderDetails[idx].flSize.split(' ')[1] === 'kB') {
        this.sendFileSize += (Number(this.delOrderDetails[idx].flSize.split(' ')[0]) * 1024);
      } else {
        this.sendFileSize += (Number(this.delOrderDetails[idx].flSize.split(' ')[0]) * 1048576);
      }

      if (this.sendFileSize <= 999999) {
        this.showUploadSize = String((this.sendFileSize / 1024).toFixed(2)) + 'KB';
      } else {
        this.showUploadSize = String((this.sendFileSize / 1048576).toFixed(2)) + 'MB';
      }
      this.delOrderDetails.splice(idx, 1);
      this.orderDetails.push(order);
      this.detector.detectChanges();
    }
  }

  async addAttachments() {
    await this.domainStore.updateFSDirList();
    const modalRef = this.modalService.open(
      FSFilesDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.storeSelector = 'editor';
    modalRef.result.then((result) => {
      if (result.files.length > 0) {
        result.files.forEach(file => {
          if (file.flSize.split(' ')[1] === 'kB') {
            this.sendFileSize += (Number(file.flSize.split(' ')[0]) * 1024);
          } else {
            this.sendFileSize += (Number(file.flSize.split(' ')[0]) * 1048576);
          }

          if (this.sendFileSize <= 999999) {
            this.showUploadSize = String((this.sendFileSize / 1024).toFixed(2)) + 'KB';
          } else {
            this.showUploadSize = String((this.sendFileSize / 1048576).toFixed(2)) + 'MB';
          }
          this.orderFilesSize = this.showUploadSize;
          this._isOrdersComplete = true;
          this.orderDetails = [...this.orderDetails, file];
          this.detector.detectChanges();
        });
        this.detector.detectChanges();
        modalRef.close();
      }
    });
  }

  addEmailAddress(event) {
    if (event.length > 0) {
      const idx = this.msgAddrList.findIndex(x => x.emailId === event[0].emailId);
      const email = event[0];
      if (idx === -1) {
        if (email.emailId.includes(' ')) {
          email.emailId = email.emailId.split(' ')[1];
        }
        if (!email.emailId.includes('<')) {
          email.emailId = '<' + email.emailId;
          if (!email.emailId.includes('>')) {
            email.emailId = email.emailId + '>';
          } else if (!email.emailId.includes('>')) {
            email.emailId = email.emailId + '>';
          }
        }
        this.msgAddrList = [...this.msgAddrList, email];
      }
    }
  }

  delEmailAttach() {
    this.globals.emailAttach = null;
  }

  resetData() {
    this.msgPacket.to = [];
    this.msgPacket.cc = [];
    this.msgPacket.bcc = [];
    this.msgPacket.subject = '';
    this.EditorValue = '';
    this.draftAttachments = [];
    this.detector.detectChanges();
  }

  goBack() {
    this.location.back();
  }
}
