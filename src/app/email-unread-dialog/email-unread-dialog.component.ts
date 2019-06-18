import { map } from 'rxjs/operators';
import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RefType } from '../models/ref-type';
import { Observable } from 'rxjs';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  refType: Observable<RefType[]>;
  refTypeData: RefTypeData[] = [];
  threadTypeData: Observable<ThreadTypeData[]>;
  typeId = 0;
  selectedThreads;
  constructor(
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.refType = this.domainStore.refType$;
    this.threadTypeData = this.domainStore.threadTypeData$;
  }

  onChange_GetRefTypeData() {
    this.spinner.show();
    if (this.typeId) {
      this.domainStore.updateRefTypeData(this.typeId);
      this.domainStore.refTypeData$.subscribe(x => {
        this.refTypeData = [];
        for (let ix = 0; ix < x.length; ix++) {
          this.refTypeData = [...this.refTypeData, x[ix]];
        }

        this.spinner.hide();

      });

    }
  }

  onSubmit() {
    // this.mailList.forEach(x => {
    //   this.selectedThreads.ThreadId = x['ThreadId'];
    //   if (x['ThreadTypeIds'] === undefined) {
    //     this.selectedThreads.ThreadTypeIds = [];
    //   } else {
    //     this.selectedThreads.ThreadTypeIds = x['ThreadTypeIds'];
    //   }
    // });

    let mapTypes = {
      typeId: "",
      refId: "",
      selectedThreads: []
    };

    for (let i = 0; i < this.mailList.length; i++) {
      mapTypes.selectedThreads.push({
        ThreadID: this.mailList[i].ThreadId,
        ThreadTypeIds: this.mailList[i].ThreadTypeIds == undefined ? [] : this.mailList[i].ThreadTypeIds
      });


    }
    console.log(mapTypes);
  }
}
