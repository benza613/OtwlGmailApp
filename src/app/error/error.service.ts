import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  method: string;
  constructor(
    private modalService: NgbModal,
  ) { }

  displayError(response, methodName) {
    this.method = methodName;
    const modalRef = this.modalService.open(
      ErrorDialogComponent,
      { size: 'lg', backdrop: 'static', keyboard: false }
    );
    modalRef.componentInstance.errId = response.errId;
    modalRef.componentInstance.errMsg = response.errMsg;
  }
}
