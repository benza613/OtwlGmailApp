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
import { Logs } from 'selenium-webdriver';
import { AuthService } from 'src/app/auth/auth.service';

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
  disableDropdowns = false;
  mappedThreadList: MappedThread[] = [];

  _queryParams = { r: null, v: null };

  constructor(
    private domainStore: DomainStoreService,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private authServ: AuthService
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
          this.refId = params.r;
          this.disableDropdowns = true;
          this._queryParams.r = params.r;
          this._queryParams.v = params.v;
          this.authServ.login();
          this.onChange_GetRefTypeData();
        } else {
          this.spinner.hide();
        }
      });
    });


    this.domainStore.threadTypeData$.subscribe(x => {
      this.threadTypeData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.threadTypeData = [...this.threadTypeData, x[ix]];
      }
      this.spinner.hide();
    });
    this.dateTo = { year: 2019, month: 6, day: 21 };
    this.dateFrom = { year: 2019, month: this.dateTo.month - 3, day: 21 };
  }

  //toggle parent reftype ddl
  onChange_GetRefTypeData() {
    this.spinner.show();
    this.refValId = null;
    if (this.refId) {
      var that = this;
      this.domainStore.updateRefTypeData(this.refId).then(function (value) {
        that.domainStore.refTypeData$.subscribe(x => {
          that.refTypeData = [];
          for (let ix = 0; ix < x.length; ix++) {
            that.refTypeData = [...that.refTypeData, x[ix]];
          }
          if (that._queryParams.v != null) {
            that.refValId = that._queryParams.v;
            that.getThreads();
          }
            that.spinner.hide();
        });
      });
    } else {
      alert('Please select a Reference Type');
    }
  }

  getThreads() {
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
