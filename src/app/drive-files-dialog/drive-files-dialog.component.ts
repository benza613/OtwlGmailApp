import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Fileresource } from './../models/fileresource.model';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drive-files-dialog',
  templateUrl: './drive-files-dialog.component.html',
  styleUrls: ['./drive-files-dialog.component.scss']
})
export class DriveFilesDialogComponent implements OnInit {

  fileResList = [];
  viewOwner = null;

  constructor(
    public emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private detector: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log('Files: ', this.fileResList);
  }

  openFile(url) {
    window.open(url);
  }

  delFile(file) {
    const that = this;
    this.spinner.show('dfspinner');
    this.emailStore.trashDrvSrvAttFile(this.viewOwner, file.id).then(value => {
      that.spinner.hide('dfspinner');
      if (value === '200') {
        that.fileResList = that.fileResList.filter(x => x.id !== file.id);
        that.detector.detectChanges();
        alert('File Deleted Successfully!');
      } else {
        alert('File Deletion Failed!');
      }
    });
  }

  dismiss() {
    this.activeModal.close();
  }

}
