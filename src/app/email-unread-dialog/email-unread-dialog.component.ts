import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RefType } from '../models/ref-type';
import { Observable } from 'rxjs';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  refType: Observable<RefType[]>;
  refTypeData: Observable<RefTypeData[]>;
  threadTypeData: Observable<ThreadTypeData[]>;
  typeId = 0;
  constructor(
    private domainStore: DomainStoreService
  ) {
    // this.domainStore.updateRefType();
  }

  ngOnInit() {
    this.refType = this.domainStore.refType$;
  }

  getRefTypeData() {
    if (this.typeId) {
      this.domainStore.updateRefTypeData(this.typeId);
      this.refTypeData = this.domainStore.refTypeData$;
      this.threadTypeData = this.domainStore.threadTypeData$;
    }
  }

}
