import { EmailsStoreService } from './../../_store/emails-store.service';
import { Component, OnInit } from '@angular/core';
import { RefType } from '../../models/ref-type';
import { Observable } from 'rxjs';
import { RefTypeData } from '../../models/ref-type-data';
import { DomainStoreService } from '../../_store/domain-store.service';
import { ThreadTypeData } from 'src/app/models/thread-type-data';
import * as moment from 'moment';

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
  typeId = 0;
  refId = 0;
  dateFrom = moment();
  dateTo = moment().subtract(31);
  constructor(
    private domainStore: DomainStoreService,
    private emailStore: EmailsStoreService
  ) {
    this.domainStore.updateRefType();
    this.domainStore.updateThreadTypeData();
    this.emailStore.updateMappedThreadList();
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
  }
  onChange_GetRefTypeData() {
    if (this.typeId) {
      this.domainStore.updateRefTypeData(this.typeId);
      this.domainStore.refTypeData$.subscribe(x => {
        this.refTypeData = [];
        for (let ix = 0; ix < x.length; ix++) {
          this.refTypeData = [...this.refTypeData, x[ix]];
        }
      });
    }
  }

  getThreads() {
    console.log(this.typeId, this.refId, moment(this.dateFrom).format('DD-MM-YYYY'), moment(this.dateTo).format('DD-MM-YYYY'));
  }

}
