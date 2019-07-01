import { DomainStoreService } from 'src/app/_store/domain-store.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    private activeModal: NgbActiveModal,
    private domainService: DomainStoreService
  ) { }

  ngOnInit() {
  }

  onConfirmation(char) {
    if (char === 'd') {
      this.domainService.deleteMapping(this.thread.ThreadUId, this.thread.ThreadGID).then(result => {
        console.log(result);
        if (result === '200') {
          this.activeModal.dismiss();
          this.response.emit(this.thread.ThreadGID);
        }
      });
    } else {
      this.activeModal.dismiss();
    }
  }

}
