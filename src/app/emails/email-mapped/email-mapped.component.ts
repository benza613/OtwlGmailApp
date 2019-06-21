import { MappedThread } from './../../models/mapped-thread';
import { EmailsStoreService } from './../../_store/emails-store.service';
import { Component, OnInit } from '@angular/core';
import { RefType } from '../../models/ref-type';
import { RefTypeData } from '../../models/ref-type-data';
import { DomainStoreService } from '../../_store/domain-store.service';
import { ThreadTypeData } from 'src/app/models/thread-type-data';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-mapped',
  templateUrl: './email-mapped.component.html',
  styleUrls: ['./email-mapped.component.scss']
})
export class EmailMappedComponent implements OnInit {
  dynamicdata: string = 'EmailMappedComponent';
  refType: RefType[] = [];
  refTypeData: RefTypeData[] = [];
  threadTypeData: ThreadTypeData[] = [];
  refValId = null;
  refId = 0;
  dateFrom: NgbDateStruct;
  dateTo: NgbDateStruct;
  disableDate = true;
  disableSelect = false;
  mappedThreadList: MappedThread[] = [];
  constructor(
    private domainStore: DomainStoreService,
    private emailStore: EmailsStoreService,
  ) {
    this.domainStore.updateRefType();
  }

  ngOnInit() {
    this.domainStore.refType$.subscribe(x => {
      this.refType = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.refType = [...this.refType, x[ix]];
      }
    });

    this.domainStore.threadTypeData$.subscribe(x => {
      this.threadTypeData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.threadTypeData = [...this.threadTypeData, x[ix]];
      }
    });

    this.dateTo = { year: 2019, month: 6, day: 21 };
    this.dateFrom = { year: 2019, month: this.dateTo.month - 3, day: 21 };
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

  getThreads() {
    const date_from = moment(this.dateFrom);
    const date_to = moment(this.dateTo);
    console.log(date_from.format('YYYY/MM/DD'));
    // tslint:disable-next-line: max-line-length
    console.log(this.refId, this.refValId, date_from.subtract(1, 'month').format('YYYY/MM/DD'), date_to.subtract(1, 'month').format('YYYY/MM/DD'));
    this.emailStore.updateMappedThreadList(this.refId, this.refValId, '', '');
    this.domainStore.updateThreadTypeData();
  }

  toggleDateFilter() {
    if (this.refValId === null) {
      this.disableDate = false;
      this.disableSelect = true;
    }
  }

  toggleSelect() {
    if (moment(this.dateFrom).format('YYYY/MM/DD') === 'Invalid date' && moment(this.dateTo).format('YYYY/MM/DD') === 'Invalid date') {
      this.disableSelect = false;
      this.disableDate = true;
    }
  }

}
