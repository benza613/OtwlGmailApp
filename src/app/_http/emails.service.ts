import { FsOrderFiles } from './../models/fs-order-files';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { MessageInlineAtt } from '../models/messageInlineAtt.model';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private readonly apiBaseUrl = env.url.server;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  };

  indexUnread(pageToken, addrFrom, addrTo, subject): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getUnreadThreads`,
      { pageToken, addrFrom, addrTo, subject },
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

  downloadLocal(msgId, attachmentGIds): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/`, 
      { msgId, attachmentGIds },
      this.httpOptions)
      .pipe(map(r => r));
  }

  requestFSDir(reqThreadId): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_GetFS`, 
      { reqThreadId },
      this.httpOptions)
      .pipe(map(r => r));
  }

  saveAttachmentToFS(entityID, qlevel, reqThreadId, msgid, attachmentGIds, fileNames): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/attachments_saveToFS`, 
      { entityID, qlevel, reqThreadId, msgid, attachmentGIds, fileNames },
      this.httpOptions)
      .pipe(map(r => r));
  }

  // tslint:disable-next-line:max-line-length
  sendNewMail(To: string[], Cc: string[], Bcc: string[], Subject: string, Body: string, inlineAttachments: MessageInlineAtt[], actionType: string, msgId: string, TokenPossession: string, orderFilesList: FsOrderFiles[]): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/postNewMail`,
      { To, Cc, Bcc, Subject, Body, inlineAttachments, actionType, msgId, TokenPossession, orderFilesList },
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
      { },
      this.httpOptions)
      .pipe(map(r => r));
  }
}
