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
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.thread.ThreadGID);
  }

  onConfirmation(char) {
    if (char === 'd') {
      //HTTP call to delete...and pass id back to remove from main mapped list
      this.activeModal.dismiss();
      this.response.emit(this.thread.ThreadGID);
    } else {
      this.activeModal.dismiss();
    }
  }

}
