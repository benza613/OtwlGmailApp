import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsService } from 'src/app/_http/emails.service';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';

@Component({
  selector: 'app-fs-dir-dialog',
  templateUrl: './fs-dir-dialog.component.html',
  styleUrls: ['./fs-dir-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FSDirDialogComponent implements OnInit {
  @Input() storeSelector: string;
  folderList;
  constructor(
    private activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService
  ) { }

  ngOnInit() {
    this.emailStore.getFolderList$.subscribe(x => {
      this.folderList = x;
    });
    console.log('Folders', this.folderList);
  }

}
