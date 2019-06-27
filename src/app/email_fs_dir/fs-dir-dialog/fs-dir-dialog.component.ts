import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsService } from 'src/app/_http/emails.service';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Observable } from 'rxjs';
import { Folders } from 'src/app/models/folders.model';

@Component({
  selector: 'app-fs-dir-dialog',
  templateUrl: './fs-dir-dialog.component.html',
  styleUrls: ['./fs-dir-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FSDirDialogComponent implements OnInit {
  @Input() storeSelector: string;
  @Input() folderHierarchy: Folders[];
  folderList: any;
  constructor(
    private activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService
  ) { }

  ngOnInit() {
    this.folderList = this.folderHierarchy.filter(x => x.qlevel == '0');
    console.log('Folders', this.folderList);
  }

}
