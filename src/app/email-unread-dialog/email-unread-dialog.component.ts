import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss']
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  refType;
  constructor(
    private domainStore: DomainStoreService
  ) { }

  ngOnInit() {
    console.log(this.mailList);
    this.refType = this.domainStore.refType$;
  }

}
