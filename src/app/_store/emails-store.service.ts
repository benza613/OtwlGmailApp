import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { EmailsService } from '../_http/emails.service';
import { Thread } from '../models/thread.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmailsStoreService {

  constructor(
    private emailServ: EmailsService,
    private router: Router) { }


  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addTicket, removeTicket, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TicketGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _threads = new BehaviorSubject<Thread[]>([]);
  private readonly _unreadThreads = new BehaviorSubject<Thread[]>([]);
  private readonly _pageTokenUnread = new BehaviorSubject<String>('');

  // Expose the observable$ part of the _tickets subject (read only stream)
  readonly threads$ = this._threads.asObservable();
  readonly unreadThreads$ = this._unreadThreads.asObservable();

  readonly threadsCount$ = this.threads$.pipe(
    map(th => this.threads.length)
  );

  readonly unreadThreadsCount$ = this.unreadThreads$.pipe(
    map(th => this.unreadThreads.length)
  );

  readonly getMsgList$ = (ThreadId) => this.threads$.pipe(
    map(tx => this.threads.find(t => t.ThreadId === ThreadId).Messages)
  )

  readonly getUnreadMsgList$ = (ThreadId) => this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.find(t => t.ThreadId === ThreadId).Messages)
  )

  readonly getCheckedMsgList$ = () => this.unreadThreads$.pipe(
    map(tx => this.unreadThreads.filter(t => t.isChecked === true))
  )

  /*
    PROPERTY GETTERS AND SETTERS
  */
  // the getter will return the last value emitted in _tickets subject
  private get threads(): Thread[] {
    return this._threads.getValue();
  }

  // assigning a value to this.tickets will push it onto the observable
  // and down to all of its subsribers (ex: this.tickets = [])
  private set threads(val: Thread[]) {
    this._threads.next(val);
  }

  private get unreadThreads(): Thread[] {
    return this._unreadThreads.getValue();
  }

  private set unreadThreads(val: Thread[]) {
    this._unreadThreads.next(val);
  }


  private get pageTokenUnread(): String {
    return this._pageTokenUnread.getValue();
  }

  private set pageTokenUnread(val: String) {
    this._pageTokenUnread.next(val);
  }


  /**
   * STORE METHODS AVAILABLE
   */
  // async updateThreadList(searchParams) {
  //   var res = await this.emailServ.index(searchParams).toPromise();
  //   console.log('emailstore Fetchall', res);

  //   if (res.d.errId == "200")
  //     this.threads = <Thread[]>res.d.threads;
  // }


  // async updateThreadEmails(ThreadId) {
  //   var res = await this.emailServ.fetchThreadEmails(ThreadId).toPromise();
  //   console.log(res);

  //   if (res.d.errId == "200") {

  //     const index = this.threads.indexOf(this.threads.find(t => t.ThreadId === ThreadId));
  //     console.log(index)
  //     for (let ix = 0; ix < res.d.msgList.length; ix++) {
  //       this.threads[index].Messages.push(res.d.msgList[ix]);
  //     }

  //     this.threads = [...this.threads];

  //     this.router.navigate(['view/' + ThreadId]);
  //   }
  // }

  async sendNewEmail(packet, body, inlineAttachments, actionType, storeSelector, MessageID, TokenPossession) {
    const res = await this.emailServ.sendNewMail(
      packet.to.map(key => key.emailId),
      packet.cc.map(key => key.emailId),
      packet.bcc.map(key => key.emailId),
      packet.subject, body, inlineAttachments,
      actionType, MessageID,
      TokenPossession).toPromise();
    console.log(res);

    if (res.d.errId === '200') {

    } else {

    }

  }

  /**
   * UNREAD module methods
   */
  async updateUnreadThreadList() {

    if (this.unreadThreads.length > 0) {

      return;
    }
    for (let idx = 0; idx < 10; idx++) {

      const res = await this.emailServ.indexUnread(this.pageTokenUnread == null ? '' : this.pageTokenUnread).toPromise();
      if (res.d.errId === '200') {
        const arrx = this.unreadThreads;
        arrx.push(...<Thread[]>res.d.threads);
        this.unreadThreads = arrx;
        if (res.d.pageToken == null) {
          break;
        } else {
          this.pageTokenUnread = res.d.pageToken;
        }
      }

      console.log(this.unreadThreads);


    }

  }

  async update_UnreadThreadEmails(ThreadId, storeSelector) {
    const res = await this.emailServ.fetchThreadEmails(ThreadId).toPromise();

    console.log(res);


    if (res.d.errId === '200') {

      const index = this.unreadThreads.indexOf(this.unreadThreads.find(t => t.ThreadId === ThreadId));

      for (let ix = 0; ix < res.d.msgList.length; ix++) {
        this.unreadThreads[index].Messages.push(res.d.msgList[ix]);
      }

      this.unreadThreads = [...this.unreadThreads];

      this.router.navigate(['view/' + ThreadId], { queryParams: { q: storeSelector === 'EmailUnreadComponent' ? 'unread' : 'mapped' } });
    }
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
      return {};
    } else {
      return {};
    }
  }



}
