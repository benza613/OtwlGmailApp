import { Router, ActivatedRoute } from '@angular/router';
import { MappedThread } from './../../models/mapped-thread';
import { EmailsStoreService } from './../../_store/emails-store.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RefType } from '../../models/ref-type';
import { RefTypeData } from '../../models/ref-type-data';
import { DomainStoreService } from '../../_store/domain-store.service';
import { ThreadTypeData } from 'src/app/models/thread-type-data';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

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
  mappedThreadList: MappedThread[] = [];
  constructor(
    private domainStore: DomainStoreService,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.domainStore.updateRefType();
  }

  ngOnInit() {
    this.spinner.show();
    this.domainStore.refType$.subscribe(x => {
      this.refType = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.refType = [...this.refType, x[ix]];
      }
      this.route.queryParams.subscribe((params) => {
        if (params.r !== undefined && params.v !== undefined) {
          params.r = this.refId;
        }
      });
      //1. if route params exists both
      //2. set r .. trigger onchange to get threadTypeData list
      //3. on fetch on threadTypeData list ... set v 
      //4. trigger GET THREADS
      this.spinner.hide();
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
    this.spinner.show();
    if (this.refId) {
      this.domainStore.updateRefTypeData(this.refId).then(function (value) {
        this.domainStore.refTypeData$.subscribe(x => {
          this.refTypeData = [];
          for (let ix = 0; ix < x.length; ix++) {
            this.refTypeData = [...this.refTypeData, x[ix]];
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        });
      });
    } else {
      alert('Please select a Reference Type');
    }
  }

  getThreads() {
    this.route.queryParams.subscribe((params) => {
      if (this.refValId !== null) {
        params.v = this.refValId;
      }
    });
    if (!this.refId) {
      alert('Please select a Reference Type');
      return;
    }
    const date_from = moment(this.dateFrom).subtract(1, 'month').format('YYYY/MM/DD');
    const date_to = moment(this.dateTo).subtract(1, 'month').format('YYYY/MM/DD');
    this.emailStore.updateMappedThreadList(this.refId, this.refValId, date_from, date_to);
    this.domainStore.updateThreadTypeData();
  }

  toggleDateFilter() {
    if (this.refValId === null) {
      this.disableDate = false;
    }
  }
}
