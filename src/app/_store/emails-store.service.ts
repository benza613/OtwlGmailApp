import { Message } from './../models/message.model';
import { DraftSearchLocks } from './../enums/draft-search-locks.enum';
import { SentSearchParams } from './../models/sent-search-params.model';
import { GlobalStoreService } from 'src/app/_store/global-store.service';
import { AddressBook } from './../models/address-book.model';
import { Folders } from '../models/folders.model';
import { Thread } from './../models/thread.model';
import { ThreadTypeData } from './../models/thread-type-data';
import { MappedThread } from './../models/mapped-thread';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EmailsService } from '../_http/emails.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ErrorService } from './../error/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchParams } from '../models/search-params.model';
import { SearchingLocks } from '../enums/searching-locks.enum';
import { SentSearchLocks } from '../enums/sent-search-locks.enum';
import { FSMapping } from '../models/fsmapping.model';
import { resolve, reject } from 'q';
import { DraftSearchParams } from '../models/draft-params.model';

@Injectable({
  providedIn: 'root'
})
export class EmailsStoreService {

  constructor(
    private emailServ: EmailsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService,
    public globals: GlobalStoreService
  ) { }


  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addTicket, removeTicket, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TicketGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _unreadThreads = new BehaviorSubject<Thread[]>([]);
  private readonly _mappedThreads = new BehaviorSubject<MappedThread[]>([]);
  private readonly _pageTokenUnread = new BehaviorSubject<String>('');
  private readonly _threadTypeList = new BehaviorSubject<ThreadTypeData[]>([]);
  private readonly _folderList = new BehaviorSubject<Folders[]>([]);
  private readonly _addressBook = new BehaviorSubject<AddressBook[]>([]);
  private readonly _lastValidSearch = new BehaviorSubject<SearchParams>(null);
  private readonly _lastValidSentSearch = new BehaviorSubject<SentSearchParams>(null);
  private readonly _lastValidDraftSearch = new BehaviorSubject<DraftSearchParams>(null);
  private readonly _LOCK_CurrentSearch = new BehaviorSubject<SearchingLocks>(SearchingLocks.Open);
  private readonly _LOCK_SentSearch = new BehaviorSubject<SentSearchLocks>(SentSearchLocks.Open);
  private readonly _LOCK_DraftSearch = new BehaviorSubject<DraftSearchLocks>(DraftSearchLocks.Open);
  private readonly _pageTokenSent = new BehaviorSubject<String>('');
  private readonly _sentThreads = new BehaviorSubject<Thread[]>([]);
  private readonly _pageTokenDraft = new BehaviorSubject<String>('');
  private readonly _draftThreads = new BehaviorSubject<Thread[]>([]);
  private readonly _fsMapList = new BehaviorSubject<FSMapping[]>([]);

  // Expose the observable$ part of the _tickets subject (read only stream)
  readonly unreadThreads$ = this._unreadThreads.asObservable();
  readonly sentThreads$ = this._sentThreads.asObservable();
  readonly draftThreads$ = this._draftThreads.asObservable();
  readonly mappedThreads$ = this._mappedThreads.asObservable();
  readonly threadTypeList$ = this._threadTypeList.asObservable();
  readonly folderList$ = this._folderList.asObservable();
  readonly addressBook$ = this._addressBook.asObservable();
  readonly fsMapList$ = this._fsMapList.asObservable();


  readonly unreadThreadsCount$ = this.unreadThreads$.pipe(
    map(th => this.unreadThreads.length)
  );

  readonly sentThreadsCount$ = this.sentThreads$.pipe(
    map(th => this.sentThreads.length)
  );

  readonly draftThreadsCount$ = this.draftThreads$.pipe(
    map(th => this.draftThreads.length)
  );

  readonly mappedThreadsCount$ = this.mappedThreads$.pipe(
    map(th => this.mappedThreads.length)
  );

  readonly getCheckedMsgList$ = this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.filter(t => t.isChecked === true))
  );

  readonly getSentCheckedMsgList$ = this.sentThreads$.pipe(
    map(tx => this.sentThreads.filter(t => t.isChecked === true))
  );

  readonly getFolderList$ = this.folderList$.pipe(
    map(r => r)
  );

  readonly getMappedMsgList$ = (ThreadId) => this.mappedThreads$.pipe(
    map(tx => this.mappedThreads.find(t => t.ThreadGID === ThreadId).Messages)
  )

  readonly getUnreadMsgList$ = (ThreadId) => this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.find(t => t.ThreadId === ThreadId).Messages)
  )

  readonly getSentMsgList$ = (ThreadId) => this.sentThreads$.pipe(
    map(tx => this.sentThreads.find(t => t.ThreadId === ThreadId).Messages)
  )

  readonly getDraftMsgList$ = (ThreadId) => this.draftThreads$.pipe(
    map(tx => this.draftThreads.find(t => t.ThreadId === ThreadId).Messages)
  )

  readonly getUnreadThreadData$ = (ThreadId) => this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.find(t => t.ThreadId === ThreadId))
  )

  readonly getMappedThreadData$ = (ThreadId) => this.mappedThreads$.pipe(
    map(tx => this.mappedThreads.find(t => t.ThreadGID === ThreadId))
  )

  readonly getSentThreadData$ = (ThreadId) => this.sentThreads$.pipe(
    map(tx => this.sentThreads.find(t => t.ThreadId === ThreadId))
  )

  readonly getDraftThreadData$ = (ThreadId) => this.draftThreads$.pipe(
    map(tx => this.draftThreads.find(t => t.ThreadId === ThreadId))
  )

  readonly getNonDeletedThread$ = (ThreadId) => this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.find(t => t.ThreadId !== ThreadId))
  )

  /*
    PROPERTY GETTERS AND SETTERS
  */
  // the getter will return the last value emitted in _tickets subject
  // assigning a value to this.tickets will push it onto the observable
  // and down to all of its subsribers (ex: this.tickets = [])

  private get unreadThreads(): Thread[] {
    return this._unreadThreads.getValue();
  }

  private set unreadThreads(val: Thread[]) {
    this._unreadThreads.next(val);
  }

  private get sentThreads(): Thread[] {
    return this._sentThreads.getValue();
  }

  private set sentThreads(val: Thread[]) {
    this._sentThreads.next(val);
  }

  private get draftThreads(): Thread[] {
    return this._draftThreads.getValue();
  }

  private set draftThreads(val: Thread[]) {
    this._draftThreads.next(val);
  }

  private get mappedThreads(): MappedThread[] {
    return this._mappedThreads.getValue();
  }

  private set mappedThreads(val: MappedThread[]) {
    this._mappedThreads.next(val);
  }

  private get threadTypeList(): ThreadTypeData[] {
    return this._threadTypeList.getValue();
  }

  private set threadTypeList(val: ThreadTypeData[]) {
    this._threadTypeList.next(val);
  }

  private get folderList(): Folders[] {
    return this._folderList.getValue();
  }

  private set folderList(val: Folders[]) {
    this._folderList.next(val);
  }

  private get lastValidSearch(): SearchParams {
    return this._lastValidSearch.getValue();
  }

  private set lastValidSearch(val: SearchParams) {
    this._lastValidSearch.next(val);
  }

  private get LOCK_CURRENTSEARCH(): SearchingLocks {
    return this._LOCK_CurrentSearch.getValue();
  }

  private set LOCK_CURRENTSEARCH(val: SearchingLocks) {
    this._LOCK_CurrentSearch.next(val);
  }

  private get lastValidSentSearch(): SentSearchParams {
    return this._lastValidSentSearch.getValue();
  }

  private set lastValidSentSearch(val: SentSearchParams) {
    this._lastValidSentSearch.next(val);
  }

  private get LOCK_SentSearch(): SentSearchLocks {
    return this._LOCK_SentSearch.getValue();
  }

  private set LOCK_SentSearch(val: SentSearchLocks) {
    this._LOCK_SentSearch.next(val);
  }

  private get lastValidDraftSearch(): DraftSearchParams {
    return this._lastValidDraftSearch.getValue();
  }

  private set lastValidDraftSearch(val: DraftSearchParams) {
    this._lastValidDraftSearch.next(val);
  }

  private get LOCK_DraftSearch(): DraftSearchLocks {
    return this._LOCK_DraftSearch.getValue();
  }

  private set LOCK_DraftSearch(val: DraftSearchLocks) {
    this._LOCK_DraftSearch.next(val);
  }

  private get pageTokenUnread(): String {
    return this._pageTokenUnread.getValue();
  }

  private set pageTokenUnread(val: String) {
    this._pageTokenUnread.next(val);
  }

  private get pageTokenSent(): String {
    return this._pageTokenSent.getValue();
  }

  private set pageTokenSent(val: String) {
    this._pageTokenSent.next(val);
  }

  private get pageTokenDraft(): String {
    return this._pageTokenDraft.getValue();
  }

  private set pageTokenDraft(val: String) {
    this._pageTokenDraft.next(val);
  }

  private get addressBook(): AddressBook[] {
    return this._addressBook.getValue();
  }

  private set addressBook(val: AddressBook[]) {
    this._addressBook.next(val);
  }

  private get fsMapList(): FSMapping[] {
    return this._fsMapList.getValue();
  }

  private set fsMapList(val: FSMapping[]) {
    this._fsMapList.next(val);
  }


  sendNewEmail(packet, body, inlineAtachments, actionType,
    storeSelector, MessageID, TokenPossession,
    orderFilesList, emailAddrList, alacarteDetails, eml, att_subject, isDraft) {
    return new Promise(async (resolve, rej) => {
      const res = await this.emailServ.sendNewMail(
        packet.to.map(key => key.emailId),
        packet.cc.map(key => key.emailId),
        packet.bcc.map(key => key.emailId),
        packet.subject, body, inlineAtachments,
        actionType, MessageID,
        TokenPossession, orderFilesList, emailAddrList, alacarteDetails, eml, att_subject, isDraft).toPromise();
      if (res.d.errId === 'None') {
        alert(res.d.errMsg);
      } else {
        alert(res.d.errMsg);
        this.errorService.displayError(res, '');
      }
      resolve(res.d.errId);
    });
  }

  /**
   * UNREAD module methods
   */
  updateUnreadThreadList(flagCount, addrFrom, addrTo, subject) {

    return new Promise(async (resolve, reject) => {
      if (flagCount === 0 && this.unreadThreads.length > 0) {
        reject();
        return;
      }

      //use this variable to terminate ongoing calls in pagination
      if (this.LOCK_CURRENTSEARCH == SearchingLocks.Open) {
        this.LOCK_CURRENTSEARCH = SearchingLocks.Acquired;
      } else if (this.LOCK_CURRENTSEARCH == SearchingLocks.Acquired) {
        this.LOCK_CURRENTSEARCH = SearchingLocks.SetForRelease;
      }

      this.unreadThreads = [];

      let arrx = [];

      this.lastValidSearch = {
        addrFrom: addrFrom,
        addrTo: addrTo,
        subject: subject
      };

      const res = await this.emailServ.indexUnread(
        this.pageTokenUnread == null ? '' : this.pageTokenUnread,
        addrFrom == null ? '' : addrFrom,
        addrTo == null ? '' : addrTo,
        subject == null ? '' : subject
      ).toPromise();
      if (res.d.errId === '200') {
        res.d.threads.forEach(x => {
          x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
        });
        arrx.push(...<Thread[]>res.d.threads);
        arrx = arrx.filter(x => x.ThreadId !== null);
        this.unreadThreads = arrx;
        if (res.d.pageToken == null) {
          this.pageTokenUnread = '';
        } else {
          this.pageTokenUnread = res.d.pageToken;
        }
      } else {
        this.errorService.displayError(res, 'indexUnread');
      }
      resolve();
    });

  }

  updateSentThreadList(flagCount, addrTo, subject) {
    return new Promise(async (resolve, reject) => {

      if (flagCount === 0 && this.sentThreads.length > 0) {
        reject();
        return;
      }

      //use this variable to terminate ongoing calls in pagination
      if (this.LOCK_SentSearch == SentSearchLocks.Open) {
        this.LOCK_SentSearch = SentSearchLocks.Acquired;
      } else if (this.LOCK_SentSearch == SentSearchLocks.Acquired) {
        this.LOCK_SentSearch = SentSearchLocks.SetForRelease;
      }

      this.sentThreads = [];

      const arrx = [];

      this.lastValidSentSearch = {
        addrTo: addrTo,
        subject: subject
      };


      const res = await this.emailServ.indexSent(
        this.pageTokenSent == null ? '' : this.pageTokenSent,
        addrTo == null ? '' : addrTo,
        subject == null ? '' : subject
      ).toPromise();
      if (res.d.errId === '200') {
        const arrx = [];
        res.d.threads.forEach(x => {
          x.Messages[0].Payload.Headers.forEach(email => {
            if (email.Name === 'To') {
              x['Msg_To'] = email.Value;
            }
          });
          x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
        });
        arrx.push(...<Thread[]>res.d.threads);
        this.sentThreads = arrx;
        if (res.d.pageToken == null) {
          this.pageTokenSent = '';
        } else {
          this.pageTokenSent = res.d.pageToken;
        }
      } else {
        this.errorService.displayError(res, 'indexSent');
      }
      resolve();
    });
  }

  updateDraftThreadList(flagCount, addrFrom, addrTo, subject) {

    return new Promise(async (resolve, reject) => {
      if (flagCount === 0 && this.draftThreads.length > 0) {
        reject();
        return;
      }

      //use this variable to terminate ongoing calls in pagination
      if (this.LOCK_DraftSearch == DraftSearchLocks.Open) {
        this.LOCK_DraftSearch = DraftSearchLocks.Acquired;
      } else if (this.LOCK_DraftSearch == DraftSearchLocks.Acquired) {
        this.LOCK_DraftSearch = DraftSearchLocks.SetForRelease;
      }

      this.draftThreads = [];

      const arrx = [];

      this.lastValidDraftSearch = {
        addrFrom: addrFrom,
        addrTo: addrTo,
        subject: subject
      };

      const res = await this.emailServ.indexDraft(
        this.pageTokenDraft == null ? '' : this.pageTokenDraft,
        addrFrom == null ? '' : addrFrom,
        addrTo == null ? '' : addrTo,
        subject == null ? '' : subject
      ).toPromise();
      if (res.d.errId === '200') {
        res.d.threads.forEach(x => {
          x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
        });
        arrx.push(...<Thread[]>res.d.threads);
        this.draftThreads = arrx;
        if (res.d.pageToken == null) {
          this.pageTokenDraft = '';
        } else {
          this.pageTokenDraft = res.d.pageToken;
        }
      } else {
        this.errorService.displayError(res, 'indexDraft');
      }
      resolve();
    });

  }


  paginateUnreadThreadList(flagCount) {
    let addfrom = this.lastValidSearch.addrFrom != undefined ? this.lastValidSearch.addrFrom : "";
    let addTo = this.lastValidSearch.addrTo != undefined ? this.lastValidSearch.addrTo : "";
    let subj = this.lastValidSearch.subject != undefined ? this.lastValidSearch.subject : "";

    return new Promise(async (resolve, reject) => {

      const arrx = [];
      arrx.push(...this.unreadThreads);



      for (let idx = 0; idx < flagCount; idx++) {

        if (this.LOCK_CURRENTSEARCH == SearchingLocks.SetForRelease) {
          this.LOCK_CURRENTSEARCH = SearchingLocks.Acquired;
          break;
        }

        const res = await this.emailServ.indexUnread(
          this.pageTokenUnread == null ? '' : this.pageTokenUnread,
          addfrom,
          addTo,
          subj
        ).toPromise();
        if (res.d.errId === '200') {
          res.d.threads.forEach(x => {
            x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
          });
          arrx.push(...<Thread[]>res.d.threads);
          this.unreadThreads = arrx;


          if (res.d.pageToken == null) {
            this.pageTokenUnread = '';
            break;
          } else {
            this.pageTokenUnread = res.d.pageToken;
          }


        } else {
          this.errorService.displayError(res, 'indexUnread');
        }

      }
      resolve();
    });
  }

  paginateSentThreadList(flagCount) {

    let addrTo = this.lastValidSentSearch.addrTo != undefined ? this.lastValidSentSearch.addrTo : "";
    let subj = this.lastValidSentSearch.subject != undefined ? this.lastValidSentSearch.subject : "";

    return new Promise(async (resolve, reject) => {
      const arrx = [];
      arrx.push(...this.sentThreads);


      for (let idx = 0; idx < flagCount; idx++) {

        if (this.LOCK_SentSearch == SentSearchLocks.SetForRelease) {
          this.LOCK_SentSearch = SentSearchLocks.Acquired;
          break;
        }

        const res = await this.emailServ.indexSent(
          this.pageTokenSent == null ? '' : this.pageTokenSent,
          addrTo,
          subj
        ).toPromise();
        if (res.d.errId === '200') {
          res.d.threads.forEach(x => {
            x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
          });
          arrx.push(...<Thread[]>res.d.threads);
          this.sentThreads = arrx;
          if (res.d.pageToken == null) {
            this.pageTokenSent = '';
            break;
          } else {
            this.pageTokenSent = res.d.pageToken;
          }

        } else {
          this.errorService.displayError(res, 'indexSent');
        }
      }
      resolve();
    });
  }


  paginateDraftThreadList(flagCount) {
    let addfrom = this.lastValidDraftSearch.addrFrom != undefined ? this.lastValidDraftSearch.addrFrom : "";
    let addTo = this.lastValidDraftSearch.addrTo != undefined ? this.lastValidDraftSearch.addrTo : "";
    let subj = this.lastValidDraftSearch.subject != undefined ? this.lastValidDraftSearch.subject : "";

    // let addfrom = "";
    // let addTo = "";
    // let subj = "";

    return new Promise(async (resolve, reject) => {

      const arrx = [];
      arrx.push(...this.draftThreads);



      for (let idx = 0; idx < flagCount; idx++) {

        if (this.LOCK_DraftSearch == DraftSearchLocks.SetForRelease) {
          this.LOCK_DraftSearch = DraftSearchLocks.Acquired;
          break;
        }

        const res = await this.emailServ.indexDraft(
          this.pageTokenDraft == null ? '' : this.pageTokenDraft,
          addfrom,
          addTo,
          subj
        ).toPromise();
        if (res.d.errId === '200') {
          res.d.threads.forEach(x => {
            x['Msg_Date'] = moment.utc(x['Msg_Date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
          });
          arrx.push(...<Thread[]>res.d.threads);
          this.draftThreads = arrx;


          if (res.d.pageToken == null) {
            this.pageTokenDraft = '';
            break;
          } else {
            this.pageTokenDraft = res.d.pageToken;
          }


        } else {
          this.errorService.displayError(res, 'indexDraft');
        }

      }
      resolve();
    });
  }

  async update_UnreadThreadEmails(flag, ThreadId, storeSelector, Subject) {
    console.log('UNREAD', storeSelector);
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.fetchThreadEmails(ThreadId).toPromise();
      const index = this.unreadThreads.indexOf(this.unreadThreads.find(t => t.ThreadId === ThreadId));
      if (res.d.errId === '200') {
        this.unreadThreads[index].Messages = [];
        for (let ix = 0; ix < res.d.msgList.length; ix++) {
          res.d.msgList[ix]['date'] = moment.utc(res.d.msgList[ix]['date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
          for (let x = 0; x < res.d.msgList[ix].attachments.length; x++) {
            if (Number(res.d.msgList[ix].attachments[x].fileSize) <= 999999) {
              res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1024).toFixed(2))
                + 'KB';
            } else {
              res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1048576).toFixed(2))
                + 'MB';
            }
          }
          this.unreadThreads[index].Messages.push(res.d.msgList[ix]);
        }
        this.unreadThreads = [...this.unreadThreads];
        if (flag === 1) {
          this.router.navigate(['view/' + ThreadId], {
            queryParams: {
              q: storeSelector === 'EmailUnreadComponent' ? 'unread' : 'mapped'
              , subject: Subject
              , isMapped: res.d.isMapped
            }
          });
        }
      } else {
        this.errorService.displayError(res, 'fetchThreadEmails');
      }
      resolve([res.d.isMapped, this.unreadThreads[index].Messages[0]]);
    });
  }


  async update_DraftThreadEmails(flag, ThreadId, storeSelector, MsgId) {
    // navigate to compose directly 
    //display attachments, patch values from headers in respective sections
    this.router.navigate(['editor/'], {
      queryParams: {
        q: storeSelector
        , tid: ThreadId
        , mid: MsgId
      }
    });
  }


  /**
   * MAPPED module methods
   */
  updateMappedThreadList(refId, refValId, dateFrom, dateTo, isAdmin) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.getMappedThreads(refId, refValId, dateFrom, dateTo, isAdmin).toPromise();
      if (res.d.errId === '200') {
        this.mappedThreads = [];
        this.threadTypeList = [];
        const arrx = [];
        const arrx2 = [];
        this.globals.tagsList = Object.assign([], <MappedThread[]>res.d.mappedThreads);
        arrx.push(...<MappedThread[]>res.d.mappedThreads);
        arrx2.push(...<ThreadTypeData[]>res.d.threadTypeList);
        for (let i = 0; i < arrx.length; i++) {
          const list2: any = [];
          arrx[i]['SelectedTypeIdList'].forEach((y: String) => {
            list2.push(arrx2.find(f => f['threadTypeId'] === y)['threadTypeVal']);
          });
          arrx[i]['SelectedTypeIdList'] = list2;
        }
        this.mappedThreads = arrx;
        this.threadTypeList = arrx2;
        resolve([res.d.errId, res.d.errMsg]);
      } else {
        reject([res.d.errId, res.d.errMsg]);
        // this.errorService.displayError(res, 'getMappedThreads');
      }
    });
  }


  update_MappedThreadEmails(ThreadId, Subject, loc_st_id) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.fetchThreadEmails(ThreadId).toPromise();
      if (res.d.errId === '200') {
        const index = this.mappedThreads.indexOf(this.mappedThreads.find(t => t.ThreadGID === ThreadId));
        this.mappedThreads[index].Messages = [];

        for (let ix = 0; ix < res.d.msgList.length; ix++) {
          res.d.msgList[ix]['date'] = moment.utc(res.d.msgList[ix]['date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
          for (let x = 0; x < res.d.msgList[ix].attachments.length; x++) {
            if (Number(res.d.msgList[ix].attachments[x].fileSize) <= 999999) {
              res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1024).toFixed(2))
                + 'KB';
            } else {
              res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1048576).toFixed(2))
                + 'MB';
            }
          }
          this.mappedThreads[index].Messages.push(res.d.msgList[ix]);
        }
        this.mappedThreads = [...this.mappedThreads];
        this.router.navigate(['view/' + ThreadId], { queryParams: { q: 'mapped', locst_id: loc_st_id, subject: Subject } });
        resolve([res.d.errId, res.d.errMsg]);
      } else {
        resolve([res.d.errId, res.d.errMsg]);
      }
    });
  }

  fetchMessage(StoreSelector, ThreadID, MessageID) {
    if (StoreSelector === 'unread') {
      const thr = this.unreadThreads.filter(x => x.ThreadId === ThreadID);
      if (thr.length > 0) {
        return {
          msgs: thr[0].Messages.filter(x => x.msgid === MessageID),
          subject: thr[0].Subject
        };
      } else {
        return {};
      }
    } else if (StoreSelector === 'mapped') {
      const thr = this.mappedThreads.filter(x => x.ThreadGID === ThreadID);
      if (thr.length > 0) {
        return {
          msgs: thr[0].Messages.filter(x => x.msgid === MessageID),
          subject: thr[0].ThreadSubject
        };
      }
    } else if (StoreSelector === 'draft') {
      const thr = this.draftThreads.filter(x => x.ThreadId === ThreadID);
      if (thr.length > 0) {
        return {
          msgs: thr[0].Messages,
          subject: thr[0].Subject
        };
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  // async MessageAttch_DownloadLocal(msgId, attachmentGIds) {
  //   await this.emailServ.downloadLocal(msgId, attachmentGIds);
  // }

  MessageAttch_RequestFSMapping(reqThreadId) {
    return new Promise(async (resolve, rej) => {
      const res = await this.emailServ.requestFSMapping(reqThreadId).toPromise();
      this.fsMapList = [];
      if (res.d.errId === '200') {
        const arrx = this.fsMapList;
        arrx.push(...<FSMapping[]>res.d.mapList);
        this.fsMapList = arrx;
        resolve([res.d.errId, res.d.errMsg]);
      } else {
        // this.errorService.displayError(res, 'requestFSMapping');
        rej([res.d.errId, res.d.errMsg]);
      }
    });

  }

  MessageAttch_RequestFSDir(jobId, rfName) {
    return new Promise(async (resolve, rej) => {
      const res = await this.emailServ.requestFSDir(jobId, rfName).toPromise();
      this.folderList = [];
      if (res.d.errId === '200') {
        const arrx = this.folderList;
        arrx.push(...<Folders[]>res.d.folders);
        this.folderList = arrx;
        resolve(res.d.mdId);
      } else {
        this.errorService.displayError(res, 'requestFSDir');
        rej(false);
      }
    });

  }

  MessageAttch_SaveToFS(entityID, qlevel, msgid, attachments, mdId) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.saveAttachmentToFS(entityID, qlevel, msgid, attachments, mdId).toPromise();
      if (res.d.errId !== '200') {
        this.errorService.displayError(res, 'saveAttachmentToFS');
        reject();
      } else {
        alert('File Upload Successfull');
        resolve('1');
      }
    });
  }

  updateAttachmentOrderDetails(reqOrderID) {
    return new Promise(async (resolve, rej) => {
      const res = await this.emailServ.requestOrderDetails(reqOrderID).toPromise();
      if (res.d.errId === '200') {
        resolve(res.d.orderFiles);
      } else {
        this.errorService.displayError(res, 'updateAttachmentOrderDetails');
        rej();
      }
    });
  }

  getUserMailInfo() {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.getUserInfo().toPromise();
      if (res.d.errId === '200') {
        // console.log(res);
        resolve(res);
      } else {
        this.errorService.displayError(res, 'getUserMailInfo');
        reject();
      }
    });
  }

  submitUnreadThreadData(mapTypes) {
    return new Promise(async (res, rej) => {
      const result = await this.emailServ.submitUnreadThreadData(mapTypes).toPromise();
      if (result.d.errId === '200') {
        mapTypes.selectedThreads.forEach(x => {
          this.unreadThreads = [...this.unreadThreads.filter(thread => thread.ThreadId !== x)];
        });
        for (let i = 0; i < mapTypes.selectedThreads.length; i++) {
          this.unreadThreads = [...this.unreadThreads.filter(x => x.ThreadId !== mapTypes.selectedThreads[i])];
        }
        res(result.d.errId);
      } else {
        this.errorService.displayError(result, 'submitUnreadThreadData');
        rej();
      }
    });
  }

  updateUnreadThreadData(mapTypes, delTagList) {
    return new Promise(async (res, rej) => {
      const result = await this.emailServ.updateUnreadThreadData(mapTypes, delTagList).toPromise();
      if (result.d.errId === '200') {
        res(result.d.errId);
      } else {
        this.errorService.displayError(result, 'updateUnreadThreadData');
        rej();
      }
    });
  }

  deleteMapping(ThreadUId, ThreadGID) {
    return new Promise(async (res, rej) => {
      const result = await this.emailServ.deleteThreadMapping(ThreadUId, ThreadGID).toPromise();
      if (result.d.errId === '200') {
        this.mappedThreads = [...this.mappedThreads.filter(x => x.ThreadGID !== ThreadGID)];
        res(result.d.errId);
        alert(result.d.errMsg);
      } else {
        this.errorService.displayError(res, 'deleteMapping');
        rej();
      }
    });
  }

  async getAddressBook() {
    const res = await this.emailServ.fetchAddressBook().toPromise();
    if (res.d.errId === '200') {
      this.addressBook = [];
      const arrx = this.addressBook;
      arrx.push(...<AddressBook[]>res.d.addressBook);
      this.addressBook = arrx;
    } else {
      this.errorService.displayError(res, 'fetchThreadTypeData');
    }
  }

  async update_SentThreadEmails(ThreadId, storeSelector, Subject) {
    const res = await this.emailServ.fetchThreadEmails(ThreadId).toPromise();
    console.log(storeSelector);
    if (res.d.errId === '200') {
      const index = this.sentThreads.indexOf(this.sentThreads.find(t => t.ThreadId === ThreadId));
      this.sentThreads[index].Messages = [];
      for (let ix = 0; ix < res.d.msgList.length; ix++) {
        res.d.msgList[ix]['date'] = moment.utc(res.d.msgList[ix]['date']).add(330, 'm').format('YYYY-MM-DD HH:mm');
        for (let x = 0; x < res.d.msgList[ix].attachments.length; x++) {
          if (Number(res.d.msgList[ix].attachments[x].fileSize) <= 999999) {
            res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1024).toFixed(2))
              + 'KB';
          } else {
            res.d.msgList[ix].attachments[x].fileSize = String((Number(res.d.msgList[ix].attachments[x].fileSize) / 1048576).toFixed(2))
              + 'MB';
          }
        }
        this.sentThreads[index].Messages.push(res.d.msgList[ix]);
      }
      this.sentThreads = [...this.sentThreads];
      this.router.navigate(['view/' + ThreadId], {
        queryParams: {
          q: storeSelector,
          subject: Subject
        }
      });
    } else {
      this.errorService.displayError(res, 'fetchThreadEmails');
    }
  }


  updateMessageStatus(storeSelector, reqThreadId, readThreads) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.updateMessageStatus(readThreads).toPromise();
      if (res.d.errId !== '200') {
        this.errorService.displayError(res, 'updateMessageStatus');
      }
      resolve(res.d.errId);
    });
  }

  markMailAsUnread(storeSelector, reqThreadId, readThreads) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.markAsUnread(readThreads).toPromise();
      if (res.d.errId !== '200') {
        this.errorService.displayError(res, 'markMailAsUnread');
      }
      resolve(res.d.errId);
    });
  }

  deleteMail(GThreadId, msgId, refValId) {
    return new Promise(async (resolve, reject) => {
      const res = await this.emailServ.deleteMail(GThreadId, msgId, refValId).toPromise();
      if (res.d.errId !== '200') {
        this.errorService.displayError(res, 'deleteMail');
      }
      resolve(res.d.errId);
    });
  }

}
