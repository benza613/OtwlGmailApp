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
    this.spinner.show('ucSpinner');
    this.domainStore.updateUCFiles(this.DT_ID, moment(this.fdt).subtract(1, 'month').format('DD-MM-YYYY'),
      moment(this.tdt).subtract(1, 'month').format('DD-MM-YYYY'), 'Non-Default').then(value => {
        that.domainStore.ucFiles$.subscribe(x => {
          that.ucFiles = [];
          for (let ix = 0; ix < x.length; ix++) {
            that.ucFiles = [...that.ucFiles, x[ix]];
          }
          that.spinner.hide('ucSpinner');
          that.detector.detectChanges();
        });
      });
  }

  submit() {
    const arrx = this.ucFiles.filter(x => x.isChecked === true);
    console.log(arrx);
  }

}
