import { ActivatedRoute, Router } from '@angular/router';
import { MappedThread } from './../../models/mapped-thread';
import { EmailsStoreService } from './../../_store/emails-store.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RefType } from '../../models/ref-type';
import { RefTypeData } from '../../models/ref-type-data';
import { DomainStoreService } from '../../_store/domain-store.service';
import { ThreadTypeData } from 'src/app/models/thread-type-data';
import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { GlobalStoreService } from 'src/app/_store/global-store.service';

@Component({
  selector: 'app-email-mapped',
  templateUrl: './email-mapped.component.html',
  styleUrls: ['./email-mapped.component.scss']
})
export class EmailMappedComponent implements OnInit {
  dynamicdata: string = 'EmailMappedComponent'; //parameter used to distinguish source component

  /* Filter reated variables */
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
  params_flag = false;
  showSearch = true;

  /* 
  * queryParams are parameters that can be included in the link/route.
  * In this case, r stands for reference type and v for reference id.
  * If a local storage value needs to be accessed, you can mention the key value of the local storage in locst_id parameter.
  * Mapped threads specific to a reference type and reference can be fetched directly be appending those values to the route path.
  */
  _queryParams = { r: null, v: null, locst_id: null };

  constructor(
    private domainStore: DomainStoreService,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private authServ: AuthService,
    public globals: GlobalStoreService,
    private detector: ChangeDetectorRef,
    public router: Router,
  ) {
    this.domainStore.updateRefType();
  }

  ngOnInit() {
    this.spinner.show();
    this.toggleDateFilter();
    this.domainStore.refType$.subscribe(x => {
      this.refType = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.refType = [...this.refType, x[ix]];
      }
      this.route.queryParams.subscribe((params) => {
        if (params.r !== undefined && params.v !== undefined) {
          this.globals.mappedRefId = params.r;
          this.disableDropdowns = true;
          this._queryParams.r = params.r;
          this._queryParams.v = params.v;
          if (params.locst_id) {
            this._queryParams.locst_id = params.locst_id;
          }
          this.authServ.login();
          this.params_flag = true;
        } else {
          this.spinner.hide();
        }
      });
    });

    /* If route contains reference type and/or reference id values. */
    if (this.params_flag) {
      setTimeout(() => {
        this.onChange_GetRefTypeData(1);
      });
    } else {
      this.onChange_GetRefTypeData(1);
    }

    this.domainStore.threadTypeData$.subscribe(x => {
      this.threadTypeData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.threadTypeData = [...this.threadTypeData, x[ix]];
      }
      this.spinner.hide();
    });
    this.globals.mappedFromDate = { year: 2019, month: 6, day: 21 };
    this.globals.mappedToDate = { year: 2019, month: this.globals.mappedFromDate.month - 3, day: 21 };
  }


  onChange_GetRefTypeData(flag?) {
    /* Based on selected reference type fetch list of references*/
    if (this.globals.mappedRefId !== 0 && this.globals.mappedRefId !== null) {
      this.spinner.show();
      this.globals.mappedRefValId = this.globals.mappedRefValId ? this.globals.mappedRefValId : null;
      var that = this;
      this.domainStore.updateRefTypeData(this.globals.mappedRefId).then(function (value) {
        that.domainStore.refTypeData$.subscribe(x => {
          that.refTypeData = [];
          for (let ix = 0; ix < x.length; ix++) {
            that.refTypeData = [...that.refTypeData, x[ix]];
          }
          that.detector.detectChanges();
          if (that._queryParams.v != null) {
            that.globals.mappedRefValId = that._queryParams.v;
            if (flag) {
              that.getThreads(that.globals.isAdmin);
            }
          }
          that.spinner.hide();
        });
      });
    }
  }

  getThreads(admin_flag) {
    /*if user is admin, get mails mapped by all users for that particular ref type and ref id*/
    this.globals.isAdmin = admin_flag;
    this.showSearch = false;
    this.detector.detectChanges();
    if (!this.globals.mappedRefId) {
      alert('Please select a Reference Type');
      return;
    }
    if (this.globals.isAdmin === 1 && !this.globals.mappedRefValId) {
      alert('Please select a Reference ID as well for admin access.');
      return;
    }
    this.spinner.show('mapped');
    const date_from = moment(this.globals.mappedFromDate).subtract(1, 'month').format('YYYY/MM/DD');
    const date_to = moment(this.globals.mappedToDate).subtract(1, 'month').format('YYYY/MM/DD');
    // tslint:disable-next-line: max-line-length
    this.emailStore.updateMappedThreadList(this.globals.mappedRefId, this.globals.mappedRefValId, date_from, date_to, this.globals.isAdmin).then(success => {
      this.spinner.hide('mapped');
    });
    this.domainStore.updateThreadTypeData();
    this.domainStore.updateFSTags();
  }

  
  toggleDateFilter() {
    if (this.globals.mappedRefValId === null) {
      this.disableDate = false;
    }
  }
}
