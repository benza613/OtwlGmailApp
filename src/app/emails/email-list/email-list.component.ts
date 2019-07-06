import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailListComponent implements OnInit {
  @Input() storeSelector: string;


  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  threadList;
  modalList = [];
  // optimization, rerenders only threads that change instead of the entire list of threads
  threadTrackFn = (i, thread) => thread.ThreadId;

  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private authServ: AuthService
    ) {

  }

  ngOnInit() {
    this.spinner.show();
    if (this.storeSelector === "EmailUnreadComponent") {
      this.emailStore.unreadThreadsCount$.subscribe(x => {
        this.t_CollectionSize = x;
      });
      this.threadList = this.emailStore.unreadThreads$;
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
  }

  onClick_GetThreadMessages(threadData) {
    this.authServ.login();
    this.emailStore.update_UnreadThreadEmails(threadData.ThreadId, this.storeSelector);
  }

  checkList(item) {
    item.isChecked = !item.isChecked;
  }
}
