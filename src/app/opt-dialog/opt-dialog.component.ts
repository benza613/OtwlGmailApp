import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-opt-dialog',
  templateUrl: './opt-dialog.component.html',
  styleUrls: ['./opt-dialog.component.scss']
})
export class OptDialogComponent implements OnInit {

  option = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private changeDetRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  close(opt) {
    this.activeModal.close(opt);
  }

}
