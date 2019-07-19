import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomainStoreService } from 'src/app/_store/domain-store.service';

@Component({
  selector: 'app-fsfiles-dialog',
  templateUrl: './fsfiles-dialog.component.html',
  styleUrls: ['./fsfiles-dialog.component.scss']
})
export class FSFilesDialogComponent implements OnInit {
  @Input() storeSelector: string;
  fsDirData: any;
  dirId;
  fileList = [];
  fileListFiltered = [];
  sendFileList = [];
  discardList = [];
  showLoaders = false;
  filterFiles;
  showFilter = false;

  constructor(
    public activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private changeDetRef: ChangeDetectorRef,
    private domainStore: DomainStoreService
  ) { }

  ngOnInit() {
    this.domainStore.fsDirData$.subscribe(x => {
      this.fsDirData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.fsDirData = [...this.fsDirData, x[ix]];
      }
      console.log(this.fsDirData);
    });
  }

  onChange_getFiles() {
    this.spinner.show('loading');
    if (this.dirId) {
      this.domainStore.updateFilesList(this.dirId);
      setTimeout(() => {
        this.domainStore.filesList$.subscribe(x => {
          this.fileList = [];
          this.spinner.hide('loading');
          for (let ix = 0; ix < x.length; ix++) {
            this.fileList = [...this.fileList, x[ix]];
            this.fileListFiltered = this.fileList;
          }
        });
      }, 3000);
    } else {
        this.fileListFiltered = [];
        this.spinner.hide('loading');
    }
  }

  addFilesToMail(file) {
    const newFile = {
      flDisplayName: file.flName,
      flID: file.flId,
      flMdDisplayName: file.flMdDisplayName,
      flMdID: file.flMdId,
      flParentFolder: file.flParentFolder,
      flSize: file.flSize,
      flTag: file.flTag,
    };
    this.sendFileList.push(newFile);
    const idx = this.fileList.indexOf(file);
    this.fileList.splice(idx, 1);
  }

  close() {
    this.activeModal.close({ files: this.sendFileList });
  }

  applyFilter() {
    this.fileListFiltered = this.fileList.filter(x => x.flName.toLowerCase().includes(this.filterFiles.trim().toLowerCase()));
  }
}
