import { SearchParams } from './../models/search-params.model';
import { GlobalStoreService } from './../_store/global-store.service';
import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RefType } from '../models/ref-type';
import { Observable } from 'rxjs';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsStoreService } from '../_store/emails-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss'],
  providers: [NgbModalConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  @Input() storeSelector: any;
  refType = [];
  refTypeData: RefTypeData[] = [];
  threadTypeData: Observable<ThreadTypeData[]>;
  refId = 1;
  refValId = 11;
  selectedThreads;
  emailList;
  constructor(
    private domainStore: DomainStoreService,
    private config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private emailServ: EmailsStoreService,
    public globals: GlobalStoreService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    console.log(this.mailList);
    this.domainStore.refType$.subscribe(x => {
      this.refType = x;
    });
    this.threadTypeData = this.domainStore.threadTypeData$;
    let tags = [];
    this.threadTypeData.subscribe(x => {
      tags = x;
    });
    if (this.globals.tagsList) {
      this.mailList.forEach(x => {
        const obj = this.globals.tagsList.filter(y => y.ThreadUId === x.ThreadUId);
        const list2: any = [];
        obj[0].SelectedTypeIdList.forEach(tag => {
          list2.push(tags.find(f => f['threadTypeVal'] === tag).threadTypeId);
        });
        x.ThreadTypeIds = list2;
      });
    }
  }

  addRefType(event) {
    const that = this;
    const idx = this.refTypeData.findIndex(x => x.refNo === event.refNo);
    console.log(event);
    if (!event || (idx !== -1)) {
      return;
    }
    if (idx === -1) {
      this.spinner.show('unreadDialog');
      this.domainStore.addFolder(event.refNo).then(function (value) {
        if (value !== '200') {
          alert('Folder addition failed. Please Retry!');
          that.refType.splice(idx, 1);
        }
        that.spinner.hide('unreadDialog');
        that.detector.detectChanges();
        that.onChange_GetRefTypeData();
      });
    }
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
    const that = this;
    if (this.storeSelector !== 'mapped') {
      if (this.refId === 0) {
        alert('Please select a Reference Type ');
        return;
      } else if (this.refValId === 0) {
        alert('Please select a Job ID');
        return;
      }
      this.spinner.show();
      const idx = this.refTypeData.findIndex(x => x['refId'] === String(this.refValId));
      console.log(idx);
      const mapTypes = {
        refId: this.refId,
        refValId: idx === -1 || idx === null ? this.refTypeData[this.refTypeData.length - 1]['refId'] : this.refTypeData[idx]['refId'],
        refNo: idx === -1 || idx === null ? this.refTypeData[this.refTypeData.length - 1]['refNo'] : this.refTypeData[idx]['refNo'],
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
      this.emailServ.submitUnreadThreadData(mapTypes).then(function (value) {
        that.spinner.hide();
        if (value === '200') {
          const res = '1';
          alert('Mapping successfully done.');
          that.activeModal.close({ action: '1', data: mapTypes.selectedThreads });
        }
      });
    }
    else {
      this.spinner.show();
      const mapTypes = {
        selectedThreads: [],
        selectedThreadsFullData: []
      };
      for (let i = 0; i < this.mailList.length; i++) {
        mapTypes.selectedThreads.push({
          ThreadID: this.mailList[i].ThreadUId,
          Remarks: this.mailList[i].Remarks,
          ThreadTypeIds: this.mailList[i].ThreadTypeIds === undefined ? [] : this.mailList[i].ThreadTypeIds
        });
      }
      mapTypes.selectedThreadsFullData = this.mailList;
      const emptyTagList = mapTypes.selectedThreads.filter(x => x.ThreadTypeIds.length === 0);
      const delTagList = [];
      if (emptyTagList.length > 0) {
        emptyTagList.forEach(x => {
          delTagList.push(x.ThreadID);
        });
      }
      this.emailServ.updateUnreadThreadData(mapTypes, delTagList).then(function (value) {
        that.spinner.hide();
        if (value === '200') {
          const res = '1';
          alert('Mapping Edit Successful !!');
          that.activeModal.close({ action: '1', data: mapTypes.selectedThreads });
        }
      });
    }
  }
}
