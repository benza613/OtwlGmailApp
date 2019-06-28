import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';

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
    public emailStore: EmailsStoreService) {

  }

  ngOnInit() {
    if (this.storeSelector === "EmailUnreadComponent") {
      this.emailStore.unreadThreadsCount$.subscribe(x => {
        this.t_CollectionSize = x;
      });
      this.threadList = this.emailStore.unreadThreads$;
    }

  }

  onClick_GetThreadMessages(threadData) {
    this.emailStore.update_UnreadThreadEmails(threadData.ThreadId, this.storeSelector);
  }

  checkList(item) {
    item.isChecked = !item.isChecked;
  }
}
