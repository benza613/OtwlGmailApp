import { DomainStoreService } from './../_store/domain-store.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RefType } from '../models/ref-type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email-unread-dialog',
  templateUrl: './email-unread-dialog.component.html',
  styleUrls: ['./email-unread-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EmailUnreadDialogComponent implements OnInit {
  @Input() mailList: any;
  refType: Observable<RefType[]>;
  constructor(
    private domainStore: DomainStoreService
  ) { }

  ngOnInit() {
    this.refType = this.domainStore.refType$;

    
  }

}
