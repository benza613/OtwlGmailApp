import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RefType } from '../models/ref-type';
import { Observable } from 'rxjs';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss'],
  providers: [NgbModalConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  refType: Observable<RefType[]>;
  refTypeData: RefTypeData[] = [];
  threadTypeData: Observable<ThreadTypeData[]>;
  refValId;
  refId = 0;
  selectedThreads;
  constructor(
    private domainStore: DomainStoreService,
    private config: NgbModalConfig,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.refType = this.domainStore.refType$;
    this.threadTypeData = this.domainStore.threadTypeData$;
  }

  onChange_GetRefTypeData() {
    this.spinner.show();
    if (this.refId) {
      this.domainStore.updateRefTypeData(this.refId);
      this.domainStore.refTypeData$.subscribe(x => {
        this.refTypeData = [];
        for (let ix = 0; ix < x.length; ix++) {
          this.refTypeData = [...this.refTypeData, x[ix]];
        }
      });
    }
    this.spinner.hide();
  }

  onSubmit() {
    if (!this.refId) {
      alert('Please select a Reference Type first');
      return;
    }
    let mapTypes = {
      refId: this.refId,
      refValId: this.refValId,
      selectedThreads: [],
      selectedThreadsFullData: []
    };
    for (let i = 0; i < this.mailList.length; i++) {
      mapTypes.selectedThreads.push({
        ThreadID: this.mailList[i].ThreadId,
        ThreadTypeIds: this.mailList[i].ThreadTypeIds === undefined ? [] : this.mailList[i].ThreadTypeIds
      });
    }
    mapTypes.selectedThreadsFullData = this.mailList;
    this.domainStore.submitUnreadThreadData(mapTypes);
  }
}
