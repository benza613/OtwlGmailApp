import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalStoreService } from 'src/app/_store/global-store.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-email-ucef',
  templateUrl: './email-ucef.component.html',
  styleUrls: ['./email-ucef.component.scss']
})
export class EmailUcefComponent implements OnInit, OnDestroy {

  dirTypes = [];
  DT_ID;
  ucFiles = [];
  fdt;
  tdt;
  fileFlag = false;
  alert: string;
  allFlag = false;
  fileId;
  displayName = undefined;
  mainDir = undefined;
  size = undefined;
  tag = undefined;
  uploadDate = null;
  dirType = undefined;

  ucefArgs = { a: '', b: '', c: '', d: '', e: '' };


  constructor(
    public emailStore: EmailsStoreService,
    public modalService: NgbModal,
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService,
    private detector: ChangeDetectorRef,
    public globals: GlobalStoreService,
    public router: Router,
  ) {

  }

  ngOnInit() {
    const that = this;
    this.globals.ucefFdt = null;
    this.globals.ucefTdt = null;
    this.domainStore.updateDirType('0', '01-01-2019', '01-12-2019', 'Default').then(value => {
      that.domainStore.dirTypes$.subscribe(x => {
        that.dirTypes = [];
        for (let ix = 0; ix < x.length; ix++) {
          that.dirTypes = [...that.dirTypes, x[ix]];
        }
        that.detector.detectChanges();
      });
    });
  }

  getUCFiles() {
    const that = this;
    this.fileFlag = false;
    this.displayName = undefined;
    this.mainDir = undefined;
    this.size = undefined;
    this.tag = undefined;
    this.uploadDate = null;
    this.dirType = undefined;
    let fromDate = '';
    let toDate = '';
    if (this.globals.ucefFdt.month !== 12) {
      fromDate = moment(this.globals.ucefFdt).subtract(1, 'month').format('YYYY-MM-DD');
    } else {
      this.globals.ucefFdt.month = 11;
      fromDate = moment(this.globals.ucefFdt).format('YYYY-MM-DD');
    }

    if (this.globals.ucefTdt !== undefined) {
      if (this.globals.ucefTdt.month !== 12) {
        toDate = moment(this.globals.ucefTdt).subtract(1, 'month').format('YYYY-MM-DD');
      } else {
        this.globals.ucefTdt.month = 11;
        toDate = moment(this.globals.ucefTdt).format('YYYY-MM-DD');
      }
    } else {
      toDate = moment(this.globals.ucefTdt).subtract(1, 'month').format('YYYY-MM-DD');
    }

    this.spinner.show('ucSpinner');
    this.domainStore.updateUCFiles(this.DT_ID, fromDate, toDate, 'Non-Default').then(value => {
      that.domainStore.ucFiles$.subscribe(x => {
        that.ucFiles = [];
        that.globals.ucefList = [];
        that.globals.ucefListFiltered = [];
        for (let ix = 0; ix < x.length; ix++) {
          that.ucFiles = [...that.ucFiles, x[ix]];
          that.globals.ucefList = [...that.globals.ucefList, x[ix]];
        }
        that.spinner.hide('ucSpinner');
        that.detector.detectChanges();
      });
      switch (this.DT_ID) {
        case 1: {
          this.dirType = 'General';
          break;
        }
        case 2: {
          this.dirType = 'Job';
          break;
        }
        case 3: {
          this.dirType = 'Contact';
          break;
        }
        case 4: {
          this.dirType = 'Shipping Line';
          break;
        }
        case 5: {
          this.dirType = 'Track n Trace';
          break;
        }
        case 6: {
          this.dirType = 'Office Courier';
          break;
        }
      }
      if (that.ucFiles.length === 0) {
        that.fileFlag = true;
        that.alert = 'No attachments available for the above chosen parameters!';
        that.detector.detectChanges();
      }
    });
  }

  submit() {
    const arrx = this.globals.ucefListFiltered.filter(x => x.isChecked === true);
    if (arrx.length === 0) {
      alert('Please select attachments before proceeding!');
      return;
    }
    arrx.forEach(x => {
      if (x.isChecked === true) {
        this.globals.ucFilesList.push(
          {
            flID: x.FL_ID,
            flDisplayName: x.FL_DisplayName,
            flMdID: x.fl_MD_ID,
            flMdDisplayName: x.DirectoryDisplayName,
            flSize: x.FL_Size,
            flTag: x.Filetag,
            flParentFolder: x.ParentFolder
          }
        );
      }
    });
    this.router.navigate(['compose/'], {
      queryParams: {
        q: 'ucef'
      }
    });
  }

  selectAll() {
    if (!this.allFlag) {
      this.globals.ucefListFiltered.forEach(x => x.isChecked = true);
      this.detector.detectChanges();
    } else {
      this.globals.ucefListFiltered.forEach(x => x.isChecked = false);
      this.detector.detectChanges();
    }
  }

  clearDateField() {
    this.uploadDate = null;
    this.applyFilter();
  }


  applyFilter() {
    this.detector.detectChanges();
    let date;
    if (this.uploadDate !== null) {
      if (this.uploadDate.month !== 12) {
        date = moment(this.uploadDate).subtract(1, 'month').format('DD/MM/YYYY');
      } else {
        this.uploadDate.month = 11;
        date = moment(this.uploadDate).format('DD/MM/YYYY');
      }
    }
    this.ucefArgs = {
      a: this.displayName,
      b: this.mainDir,
      c: this.tag,
      d: date,
      e: this.size
    };
    console.log(this.globals.ucefList);
  }

  ngOnDestroy() {
    this.detector.detach();
  }

}
