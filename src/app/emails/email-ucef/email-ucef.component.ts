import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
export class EmailUcefComponent implements OnInit {

  dirTypes = [];
  DT_ID;
  ucFiles = [];
  fdt;
  tdt;
  fileFlag = false;
  alert: string;


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
    let fromDate = '';
    let toDate = '';
    if (this.fdt.month !== 12) {
      fromDate = moment(this.fdt).subtract(1, 'month').format('YYYY-MM-DD');
    } else {
      this.fdt.month = 11;
      fromDate = moment(this.fdt).format('YYYY-MM-DD');
    }

    if (this.tdt !== undefined) {
      if (this.tdt.month !== 12) {
        toDate = moment(this.tdt).subtract(1, 'month').format('YYYY-MM-DD');
      } else {
        this.tdt.month = 11;
        toDate = moment(this.tdt).format('YYYY-MM-DD');
      }
    } else {
      toDate = moment(this.tdt).subtract(1, 'month').format('YYYY-MM-DD');
    }

    this.spinner.show('ucSpinner');
    this.domainStore.updateUCFiles(this.DT_ID, fromDate, toDate, 'Non-Default').then(value => {
      that.domainStore.ucFiles$.subscribe(x => {
        that.ucFiles = [];
        for (let ix = 0; ix < x.length; ix++) {
          that.ucFiles = [...that.ucFiles, x[ix]];
        }
        that.spinner.hide('ucSpinner');
        that.detector.detectChanges();
      });
      if (that.ucFiles.length === 0) {
        that.fileFlag = true;
        that.alert = 'No attachments available for the above chosen parameters!';
        that.detector.detectChanges();
      }
    });
  }

  submit() {
    const arrx = this.ucFiles.filter(x => x.isChecked === true);
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


}
