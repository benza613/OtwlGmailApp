import { Component, OnInit, Input } from '@angular/core';
import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  @Input() res: any;
  constructor(
    private domainStore: DomainStoreService,
    private spinner: NgxSpinnerService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
