import { MessageUiAttach } from './../models/message-ui-attach.model';
import { FsOrderFiles } from './../models/fs-order-files';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { MessageInlineAtt } from '../models/messageInlineAtt.model';
import { ErrorService } from '../error/error.service';


@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private readonly apiBaseUrl = env.url.server;
  private readonly apiBaseUrl_Download = env.url.downloadsGA;
  private readonly apiBaseUrl_Preview = env.url.previewGA;
  private readonly apiBaseUrl_HtmlPdf = env.url.uploadHtmlPdf;

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

  indexSent(pageToken): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getSentThreads`,
      { pageToken },
      this.httpOptions)
      .pipe(map(r => r));
  }

  getMappedThreads(refID, refValId, dateFrom, dateTo): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getMappedThreads`, { refID, refValId, dateFrom, dateTo }, this.httpOptions)
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
        console.log('eeee', <any>response);
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
        console.log('eeee', <any>response);

        if (response['headers'].get('content-type') === 'text/plain') {
          this.errorServ.displayError(response, '');
        } else {
          const blob = new Blob([response['body'] as Blob], {
            type: response['headers'].get('content-type')
          });
          console.log('BLOB', blob);
          resolve(blob);
          const iurl = window.URL.createObjectURL(blob);
          window.open(iurl, '_blank');
        }
      });
    });
  }

  uploadPDF(entityID, qlevel, pdfFile) {
      return new Promise(async (resolve, reject) => {
        const blob = new Blob([pdfFile as Blob], {
          type: 'application/pdf'
        });
        console.log(pdfFile);
        resolve('200');
      });
  }

  requestFSDir(reqThreadId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_GetFS`,
      { reqThreadId },
      this.httpOptions)
      .pipe(map(r => r));
  }

  saveAttachmentToFS(entityID, qlevel, reqThreadId, msgid, attachments): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_saveToFS`,
      { entityID, qlevel, reqThreadId, msgid, attachments },
      this.httpOptions)
      .pipe(map(r => r));
  }

  // tslint:disable-next-line:max-line-length
  sendNewMail(To: string[], Cc: string[], Bcc: string[], Subject: string, Body: string, inlineAttachments: MessageInlineAtt[], actionType: string, msgId: string, TokenPossession: string, orderFilesList: FsOrderFiles[], emailAddrList: string[]): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/postNewMail`,
      { To, Cc, Bcc, Subject, Body, inlineAttachments, actionType, msgId, TokenPossession, lstFsOrderFiles: orderFilesList, emailAddrList },
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
}
