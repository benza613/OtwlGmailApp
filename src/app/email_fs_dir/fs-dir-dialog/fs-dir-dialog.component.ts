import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
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
  @Input() attachmentGIds;
  @Input() attachmentNames;
  @Input() reqThreadId;
  folderList: any;
  backDisable = true;
  browseDisable = false;


  constructor(
    public activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private changeDetRef: ChangeDetectorRef
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
        this.folderList = this.folderHierarchy.filter(x => x.qlevel === '0');
      }
    } else {
      if (this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
        x.isParentFolder_ID === folder.entityID).length > 0) {
        this.folderList = this.folderHierarchy.filter(x => Number(x.qlevel) === (Number(folder.qlevel) + 1) &&
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
    this.spinner.show();
    var that = this;
    setTimeout(() => {
      this.emailStore.MessageAttch_SaveToFS(folder.entityID, folder.qlevel, this.reqThreadId,
        this.msgId, this.attachmentGIds, this.attachmentNames).then(function (value) {
          if (value === '1') {
            that.spinner.hide();
            that.changeDetRef.detectChanges();
          }
        });
    }, 2000);
  }
}
