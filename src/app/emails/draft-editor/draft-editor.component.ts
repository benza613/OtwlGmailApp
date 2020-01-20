import { OptDialogComponent } from './../../opt-dialog/opt-dialog.component';
import { UCFileList } from './../../models/ucfile-list';
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
import { EmailsService } from 'src/app/_http/emails.service';

const URL = environment.url.uploadsGA;

@Component({
  selector: 'app-draft-editor',
  templateUrl: './draft-editor.component.html',
  styleUrls: ['./draft-editor.component.scss']
})
export class DraftEditorComponent implements OnInit {

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
  dwnldDraftAttachs = [];

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
    private emailServ: EmailsService,
    public globals: GlobalStoreService
  ) { }

  ngOnInit() {
    this._TOKEN_POSSESION = this.randomTokenGenerator(6) + '-' + this.randomTokenGenerator(6);

    // get query string if exists
    // if q->unread/mapped & i->exists
    //  initfromStore
    // TODO else initfromLocalStorage if present

    // angular number pipe
    // https://github.com/angular/angular/blob/1608d91728af707d9740756a80e78cfb1148dd5a/
    // modules/%40angular/common/src/pipes/number_pipe.ts#L82


    this.uploader.onAfterAddingFile = (fileItem) => {
      if (!(fileItem.file.size > this.globals.maxFileSize)) {
        this.uploadFilesSize += fileItem.file.size;
      } else {
        this.uploader.queue.splice(this.uploader.queue.indexOf(fileItem), 1);
        alert('File size exceeds max allowed limit. Please keep it below 20 MB!');
      }
      this.detector.detectChanges();
    };

    this.uploader.removeFromQueue = (fileItem) => {
      this.uploader.queue.splice(this.uploader.queue.indexOf(fileItem), 1);
      this.uploadFilesSize -= fileItem.file.size;
      this.detector.detectChanges();
    };

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
      // that.fillSignatureTemplate(that.senderName, that.senderDesgn, that.senderMobile, that.senderEmail,
      //   that.senderLandline, that.senderWeChat, that.senderSkype);
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
          this.msgPacket.bcc = this.msgPacket.bcc.filter(x => !x.emailId.includes(this.senderEmail));
          this.detector.detectChanges();
        }
      });
    });

    this.route.queryParams
      .subscribe(params => {

        //navigating to compose from drafts to create a new draft
        this._isDraft = this.globals.globals_isDraft ? 'true' : 'false';
        if (params.q !== undefined && params.q === 'draft') {
          this._reqStoreSelector = params.q;
          this._reqThreadID = params.tid;
          this._reqMessageID = params.mid;
          this._reqActionType = params.a;
          const x = this.emailStore.fetchMessage(this._reqStoreSelector, this._reqThreadID, this._reqMessageID);
          if (x.msgs !== undefined && x.msgs.length > 0) {
            this.recycleDraftGmailAddressFields(x.msgs);
            this.msgPacket.subject = x.subject;
            x.msgs[0].attachments.forEach(att => {
              if (att.fileName !== '') {
                this.draftAttachments.push(att);
              }
            });
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
                this._inlineAttachB64, this._reqActionType === 'd' ? null : this._reqActionType, this._reqStoreSelector,
                this._reqMessageID, this._TOKEN_POSSESION, this.orderDetails, emailList,
                this.alacarteDetails, this.globals.emailAttach, this.globals.subject, this._isDraft, true)
                .then(function (value) {
                  that.spinner.hide();
                  that.globals.emailAttach = null;
                  that.globals.ucFilesList = [];
                  that.detector.detectChanges();
                  if (that._reqStoreSelector !== '') {
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

  async onClick_SendMail(flag) {
    this.detector.detectChanges();
    this._isDraft = flag === '0' ? 'true' : 'false';
    const that = this;
    await this.newAddrList();
    if (this.msgPacket.to.length !== 0 || this.msgPacket.cc.length !== 0 || this.msgPacket.bcc.length !== 0) {
      if (flag !== '0') {
        const modalRef = this.modalService.open(
          OptDialogComponent,
          { size: 'lg', backdrop: 'static', keyboard: false }
        );
        modalRef.result.then(value => {
          that.sendMail(value);
        });
      } else if (flag === '0') {
        that.updateDraft();
      }
    } else {
      alert('Please Select atleast 1 recipient');
    }
  }

  sendMail(option) {
    const that = this;
    this.spinner.show();
    this.detector.detectChanges();
    if (option === 0) {
      return;
    }
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
                this._inlineAttachB64, this._reqActionType === 'd' ? null : this._reqActionType, this._reqStoreSelector,
                this._reqMessageID, this._TOKEN_POSSESION, this.orderDetails, emailList,
                this.alacarteDetails, this.globals.emailAttach, this.globals.subject, this._isDraft, option === 1 ? false : true)
                .then(function (value) {
                  that.spinner.hide();
                  that.detector.detectChanges();
                  that.globals.emailAttach = null;
                  that.globals.ucFilesList = [];
                  that._TOKEN_POSSESION = that.randomTokenGenerator(6) + '-' + that.randomTokenGenerator(6);
                  that.resetData();
                  if (that._reqStoreSelector === 'draft') {
                    if (that._isDraft === 'false') {
                      that.emailStore.discardDraft(that._reqThreadID);
                    }
                    that.location.back();
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
  }

  updateDraft() {
    const that = this;
    this.spinner.show();
    this.detector.detectChanges();
    let draft_attachIds = [];
    this.draftAttachments.forEach(x => {
      draft_attachIds.push(x.attachmentGId);
    });
    if (this.uploader.queue.length === 0) {
      this.base64InlineAttachmentsToBody().then(
        (data) => {
          this.base64EmbeddedAttachmentsToBody(data).then(
            (finalBody) => {
              // then send mail
              this.emailStore.updateDraft(
                this.msgPacket,
                finalBody + this.footerHtml,
                this._inlineAttachB64,
                this._reqActionType === 'd' ? null : this._reqActionType,
                this._reqMessageID,
                draft_attachIds,
                this._TOKEN_POSSESION,
                this.orderDetails,
                this.globals.emailAttach,
                this.globals.subject)
                .then(function (value) {
                  that.spinner.hide();
                  that.detector.detectChanges();
                  draft_attachIds = [];
                  that._TOKEN_POSSESION = that.randomTokenGenerator(6) + '-' + that.randomTokenGenerator(6);
                  that.resetData();
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
  }

  newAddrList() {
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
  }

  removeDraftAttach(att) {
    this.draftAttachments = this.draftAttachments.filter(x => x.attachmentGId !== att.attachmentGId);
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

  // fillSignatureTemplate(senderName, senderDesgn, senderMobile, senderEmail, senderLandline, senderWeChat, senderSkype) {
  //   this.signatureHtml = '';
  //   this.footerHtml = '';
  // }

  private recycleDraftGmailAddressFields(msgs) {
    msgs[0].msgBcc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'd') {
          this.msgPacket.bcc.push({ emailId: element });
        }
      }
    });

    msgs[0].msgCc.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'd') {
          this.msgPacket.cc.push({ emailId: element });
        }
      }
    });

    msgs[0].msgTo.split(',').forEach(element => {
      if (element !== undefined && element !== '') {
        this.msgAddrList.push({ emailId: element });
        if (this._reqActionType === 'd') {
          this.msgPacket.to.push({ emailId: element });
          this.detector.detectChanges();
        }
      }
    });
    this.EditorValue = msgs[0].body;
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

  dwnldList(att) {
    if (document.getElementById(att.attachmentGId).style.color !== 'red') {
      document.getElementById(att.attachmentGId).setAttribute('style', 'color: red !important;padding: 5px; cursor: pointer;');
      this.dwnldDraftAttachs.push([att.attachmentGId, att.fileName]);
    } else {
      document.getElementById(att.attachmentGId).setAttribute('style', 'color: royalblue;padding: 5px; cursor: pointer;');
      const idx = this.dwnldDraftAttachs.findIndex(x => x.attachmentGId === att.attachmentGId);
      this.dwnldDraftAttachs.splice(idx, 1);
    }
  }

  downloadDraftAttachs() {
    if (this.dwnldDraftAttachs.length === 0) {
      this.draftAttachments.forEach(x => {
        this.dwnldDraftAttachs.push([x.attachmentGId, x.fileName]);
      });
    }
    const that = this;
    if (this.dwnldDraftAttachs.length > 0) {
      this.emailServ.downloadLocal(this._reqMessageID, this.dwnldDraftAttachs).then(function (value) {
        that.spinner.hide();
        that.detector.detectChanges();
        if (value[0] !== '200') {
          const res = {
            d: {
              errId: '',
              errMsg: ''
            }
          };
          res.d.errId = value[0];
          res.d.errMsg = value[1];
        }
      });
    }
  }

  delEmailAttach() {
    this.globals.emailAttach = null;
  }

  resetData() {
    this.msgPacket.to = [];
    this.msgPacket.cc = [];
    this.msgPacket.bcc = [];
    this.orderDetails = [];
    this.delOrderDetails = [];
    this.msgPacket.subject = '';
    this.EditorValue = 'Dear Sir/ Madam, <br/>';
    this.globals.emailAttach = null;
    this.globals.ucFilesList = [];
    this.draftAttachments = [];
    this.detector.detectChanges();
  }

  goBack() {
    this.location.back();
    this.globals.emailAttach = null;
    this.globals.ucFilesList = [];
    this.orderDetails = [];
  }

}
