import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  thread;
  showDetails = 0;
  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.thread.threadGId);
  }

}
