import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { Folders } from 'src/app/models/folders.model';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'src/environments/environment.prod';
import { NgTypeToSearchTemplateDirective } from '@ng-select/ng-select/ng-select/ng-templates.directive';

const URL = environment.url.uploadPdf;

function readBase64(file): Promise<any> {
  let reader  = new FileReader();
  let future = new Promise((resolve, reject) => {
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}


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
  @Input() attachments;
  @Input() attachmentGIds;
  @Input() attachmentNames;
  @Input() reqThreadId;
  @Input() uploadType: string;
  folderList: any;
  fsDirData: any;
  backDisable = true;
  browseDisable = false;
  dirId;
  fileList = [];
  file;
  @Output() response: EventEmitter<any> = new EventEmitter();
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private emailStore: EmailsStoreService,
    private spinner: NgxSpinnerService,
    private changeDetRef: ChangeDetectorRef,
    private domainStore: DomainStoreService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (this.storeSelector !== 'editor') {
      this.folderList = this.folderHierarchy.filter(x => x.qlevel == '0');
      // console.log('Folder List',this.folderList);
    }
    this.domainStore.fsDirData$.subscribe(x => {
      this.fsDirData = [];
      for (let ix = 0; ix < x.length; ix++) {
        this.fsDirData = [...this.fsDirData, x[ix]];
      }
      // console.log('Dir List',this.fsDirData);
    });

    this.uploader.removeFromQueue = (fileItem) => {
      this.uploader.queue.splice(this.uploader.queue.indexOf(fileItem), 1);
      this.detector.detectChanges();
    };
    this.uploader.onProgressAll = (progress: any) => this.detector.detectChanges();
    //this.uploader.options.removeAfterUpload = true;

    this.uploader.options.isHTML5 = true;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      item.remove();
    }

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('err', item.file.name);
    }

    this.uploader.onCompleteAll = () => {
      this.uploader.progress = 0;
      this.detector.detectChanges();

      if (this.uploader.queue.length > 0) {
        alert('File upload unsuccessful!');
      }
    }
  }

  onFileSelected(event: EventEmitter<File[]>) {
    const data: File = event[0];
    this.file = data;

    // readBase64(file)
    //   .then(function(data) {
    //   that.file = data
    // });

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
    console.log('Folder', folder);
    var that = this;
    if (this.uploadType === 'email_attachment') {
      this.emailStore.MessageAttch_SaveToFS(folder.entityID, folder.qlevel, this.reqThreadId,
        this.msgId, this.attachments).then(function (value) {
          if (value === '1') {
            that.spinner.hide();
            that.changeDetRef.detectChanges();
          }
        });
    } else {
      // console.log(this.uploader.queue[0]);
      this.activeModal.dismiss();
      this.activeModal.close();
      this.response.emit([folder.entityID, folder.qlevel, this.file]);
    }
  }
}
