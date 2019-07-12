import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
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
  refValId = 0;
  refId = 0;
  selectedThreads;
  constructor(
    private domainStore: DomainStoreService,
    private config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.refType = this.domainStore.refType$;
    this.threadTypeData = this.domainStore.threadTypeData$;
  }

  onChange_GetRefTypeData() {
    if (this.refId) {
      this.domainStore.updateRefTypeData(this.refId);
      this.domainStore.refTypeData$.subscribe(x => {
        this.refTypeData = [];
        for (let ix = 0; ix < x.length; ix++) {
          this.refTypeData = [...this.refTypeData, x[ix]];
        }
      });
    }
  }

  onSubmit() {
    const idx = this.refTypeData.findIndex(x => x['refId'] === String(this.refValId));
    if (this.refId === 0) {
      alert('Please select a Reference Type ');
      return;
    } else if (this.refValId === 0) {
      alert('Please select a Job ID');
      return;
    }
    this.spinner.show();
    const mapTypes = {
      refId: this.refId,
      refValId: this.refValId,
      refNo: this.refTypeData[idx]['refNo'],
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

    var that = this;
    this.domainStore.submitUnreadThreadData(mapTypes).then(function (value) {
      that.spinner.hide();
      if (value === '200') {
        const res = '1';
        alert('Mapping successfully done.');
        that.activeModal.close({ action: '1' });
      }
    });
  }
}
