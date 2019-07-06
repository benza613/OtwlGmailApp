import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailsService } from 'src/app/_http/emails.service';
import { EmailsStoreService } from 'src/app/_store/emails-store.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  thread;
  showDetails = false;
  @Output() response: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    private emailServ: EmailsStoreService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  onConfirmation(char) {
    this.spinner.show();
    if (char === 'd') {
      this.emailServ.deleteMapping(this.thread.ThreadUId, this.thread.ThreadGID).then(result => {
        if (result === '200') {
          this.spinner.hide();
          this.activeModal.dismiss();
          this.response.emit(this.thread.ThreadGID);
        }
      });
    } else {
      this.activeModal.dismiss();
    }
  }

}
