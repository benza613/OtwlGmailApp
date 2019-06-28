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
  @Input() msgId;
  @Input() attachmentGId;
  @Input() attachmentName;
  folderList: any;
  backDisable = true;
  browseDisable = false;


  constructor(
    private activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService
  ) { }

  ngOnInit() {
    this.folderList = this.folderHierarchy.filter(x => x.qlevel == '0');
  }

  incrementLevel(folder, idx) {
    this.backDisable = false;
    if (Number(folder.qlevel) === 0) {
      if (this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
        x.isTemplateFolder_ID === folder.entityID).length > 0) {
        this.folderList = this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
          x.isTemplateFolder_ID === folder.entityID);
      } else {
        this.backDisable = true;
        this.folderList = this.folderHierarchy.filter(x => x.qlevel == '0');
      }
    } else {
      if (this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
        x.isParentFolder_ID === folder.entityID).length > 0) {
        this.folderList = this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
          x.isParentFolder_ID === folder.entityID);
      } else {
        this.folderList = this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel)) &&
          x.isParentFolder_ID === folder.entityID);
      }
    }
  }

  decrementLevel() {
    this.backDisable = Number(this.folderList[0].qlevel) - 1 === 0 ? true : false;
    if (Number(this.folderList[0].qlevel) === 0) {
      this.backDisable = true;
      this.folderList = this.folderHierarchy.filter(x => x.qlevel === '0');
    } else {
      this.folderList = this.folderHierarchy.filter(x => Number(x.qlevel) === Number(this.folderList[0].qlevel) - 1);
    }
  }

  saveToFS(folder) {
     this.emailStore.MessageAttch_SaveToFS(folder.entityID,  folder.qlevel,  this.msgId,  this.attachmentGId,  this.attachmentName);
  }




}
