import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';

@Component({
  selector: 'app-email-list2',
  templateUrl: './email-list2.component.html',
  styleUrls: ['./email-list2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailList2Component implements OnInit {
  @Input() storeSelector: string;
  t_CollectionSize: number;
  t_currentPage = 1;
  t_itemsPerPage = 10;
  mappedThreads;
  constructor(
    public emailStore: EmailsStoreService
  ) { }

  ngOnInit() {
    this.emailStore.mappedThreadsCount$.subscribe(x => {
      this.t_CollectionSize = x;
    });
    this.mappedThreads = this.emailStore.mappedThreads$;
    console.log(this.mappedThreads);
  }

}
