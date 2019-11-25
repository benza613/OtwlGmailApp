import { FsOrderFiles } from './../models/fs-order-files';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { MessageInlineAtt } from '../models/messageInlineAtt.model';
import { ErrorService } from '../error/error.service';
import { Message } from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private readonly apiBaseUrl = env.url.server;
  private readonly apiBaseUrl_Download = env.url.downloadsGA;
  private readonly apiBaseUrl_Preview = env.url.previewGA;
  private readonly apiBaseUrl_Pdf = env.url.uploadPdf;

  constructor(
    private http: HttpClient,
    private errorServ: ErrorService
  ) { }

  httpOptions = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  };

  // httpOptions_download = {
  //   responseType: 'blob',
  //   headers: {
  //     'Content-Type': 'application/json;charset=utf-8',
  //   }
  // };

  indexUnread(pageToken, addrFrom, addrTo, subject): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getUnreadThreads`,
      { pageToken, addrFrom, addrTo, subject },
      this.httpOptions)
      .pipe(map(r => r));
  }

  indexSent(pageToken, addrTo, subject): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getSentThreads`,
      { pageToken, addrTo, subject },
      this.httpOptions)
      .pipe(map(r => r));
  }

  indexDraft(pageToken, addrFrom, addrTo, subject): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getDraftThreads`,
      { pageToken, addrFrom, addrTo, subject },
      this.httpOptions)
      .pipe(map(r => r));
  }

  getMappedThreads(refID, refValId, dateFrom, dateTo, isAdmin): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getMappedThreads`, { refID, refValId, dateFrom, dateTo, isAdmin }, this.httpOptions)
      .pipe(map(r => r));
  }

  fetchThreadEmails(ThreadId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getThreadEmails`,
      { ThreadId },
      this.httpOptions)
      .pipe(map(r => r));
  }

  downloadLocal(msgId, downloadFileObject) {
    return new Promise((resolve) => {

      const optionsN = {
        headers: new HttpHeaders()
      };

      optionsN['responseType'] = 'blob';
      optionsN['params'] = { msgId, lstAttch: JSON.stringify(downloadFileObject) };
      optionsN['observe'] = 'response';

      this.http.get(`${this.apiBaseUrl_Download}`, optionsN).subscribe(response => {
        resolve(response);
        if (response['headers'].get('content-type') === 'text/plain') {
          this.errorServ.displayError(response, '');
        } else {
          const blob = new Blob([response['body'] as Blob], {
            type: response['headers'].get('content-type')
              || 'application/x-zip-compressed'
          });
          const iurl = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = response['headers'].get('x-filename') || 'abc.zip';
          anchor.href = iurl;
          anchor.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));
          anchor.remove();
        }
      });
    });
  }

  previewLocal(msgId, attachmentId, attachmentName) {
    return new Promise((resolve) => {

      const optionsN = {
        headers: new HttpHeaders()
      };

      optionsN['responseType'] = 'blob';
      optionsN['params'] = { msgId, attachmentId, attachmentName };
      optionsN['observe'] = 'response';

      this.http.get(`${this.apiBaseUrl_Preview}`, optionsN).subscribe(response => {
        if (response['headers'].get('content-type') === 'text/plain') {
          this.errorServ.displayError(response, '');
        } else {
          const blob = new Blob([response['body'] as Blob], {
            type: response['headers'].get('content-type')
          });
          resolve(blob);
          const iurl = window.URL.createObjectURL(blob);
          window.open(iurl, '_blank');
        }
      });
    });
  }

  restoreEmailBodyImages(msgId, attachmentId, attachmentName) {
    return new Promise((resolve) => {

      const optionsN = {
        headers: new HttpHeaders()
      };

      optionsN['responseType'] = 'blob';
      optionsN['params'] = { msgId, attachmentId, attachmentName };
      optionsN['observe'] = 'response';

      this.http.get(`${this.apiBaseUrl_Preview}`, optionsN).subscribe(response => {
        // console.log('eeee', <any>response);

        if (response['headers'].get('content-type').includes('text/plain')) {
          this.errorServ.displayError(response, '');
        } else {
          const blob: Blob = new Blob([response['body'] as Blob], {
            type: response['headers'].get('content-type')
          });

          const url = URL.createObjectURL(blob);
          resolve(url);
        }
      });
    });
  }

  uploadPDF(formData) {
    return new Promise(async (resolve, reject) => {
      this.http.post(`${this.apiBaseUrl_Pdf}`, formData).subscribe(x => {
        resolve('200');
      });
    });
  }

  requestFSMapping(reqThreadId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_GetMapping`,
      { reqThreadId },
      this.httpOptions)
      .pipe(map(r => r));
  }

  requestFSDir(refValId, dirTypeName): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_GetFS`,
      { refValId, dirTypeName },
      this.httpOptions)
      .pipe(map(r => r));
  }

  saveAttachmentToFS(entityID, qlevel, msgid, attachments, mdId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_saveToFS`,
      { entityID, qlevel, msgid, attachments, mdId },
      this.httpOptions)
      .pipe(map(r => r));
  }

  // tslint:disable-next-line:max-line-length
  sendNewMail(To: string[], Cc: string[], Bcc: string[], Subject: string, Body: string, inlineAttachments: MessageInlineAtt[], actionType: string, msgId: string, TokenPossession: string, orderFilesList: FsOrderFiles[], emailAddrList: string[], alacarteDetails: string[], eml: Message[], att_sub: string, isDraft: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/postNewMail`,
      {
        To, Cc, Bcc, Subject, Body, inlineAttachments, actionType,
        msgId, TokenPossession, lstFsOrderFiles: orderFilesList, emailAddrList,
        lstAlaCarte: alacarteDetails, eml, att_sub, isDraft
      },
      this.httpOptions)
      .pipe(map(r => r));
  }

  requestOrderDetails(reqOrderID): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_FsOrderDetails`,
      { reqOrderID },
      this.httpOptions)
      .pipe(map(r => r));
  }

  getUserInfo(): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getUserMailInfo`,
      {},
      this.httpOptions)
      .pipe(map(r => r));
  }

  submitUnreadThreadData(mapTypes): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/insertThreadDomainMapping`, { mapTypes }, this.httpOptions)
      .pipe(map(r => r));
  }

  deleteThreadMapping(ThreadUId, ThreadGId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/deleteThreadRefMapping`, { ThreadUId, ThreadGId },
      this.httpOptions).pipe(map(r => r));
  }

  fetchAddressBook(): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/fetchAddressBook`, {}, this.httpOptions)
      .pipe(map(r => r));
  }

  updateMessageStatus(readThreadIds): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/markMailsAsRead`, { readThreadIds }, this.httpOptions)
      .pipe(map(r => r));
  }

  markAsUnread(readThreadIds): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/markMailAsUnread`, { readThreadIds }, this.httpOptions)
      .pipe(map(r => r));
  }

  updateUnreadThreadData(mapTypes, threadUIds): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/updateThreadDomainMapping`, { mapTypes, threadUIds }, this.httpOptions)
      .pipe(map(r => r));
  }

  deleteMail(GThreadId, msgid, refValId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/deleteMail`, { GThreadId, msgid, refValId }, this.httpOptions)
      .pipe(map(r => r));
  }
}
