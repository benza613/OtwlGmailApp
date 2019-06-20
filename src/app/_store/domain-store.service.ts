import { DomainService } from './../_http/domain.service';
import { Thread } from './../models/thread.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefType } from '../models/ref-type';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from '../error/error-dialog/error-dialog.component';
import { EmailsService } from '../_http/emails.service';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService,
    private modalService: NgbModal,
    private emailService: EmailsService
  ) { }

  private readonly _refType = new BehaviorSubject<RefType[]>([]);
  private readonly _refTypeData = new BehaviorSubject<RefTypeData[]>([]);
  private readonly _threadTypeData = new BehaviorSubject<ThreadTypeData[]>([]);

  readonly refType$ = this._refType.asObservable();
  readonly refTypeData$ = this._refTypeData.asObservable();
  readonly threadTypeData$ = this._threadTypeData.asObservable();

  private get refType(): RefType[] {
    return this._refType.getValue();
  }

  private set refType(val: RefType[]) {
    this._refType.next(val);
  }

  private get refTypeData(): RefTypeData[] {
    return this._refTypeData.getValue();
  }

  private set refTypeData(val: RefTypeData[]) {
    this._refTypeData.next(val);
  }

  private get threadTypeData(): ThreadTypeData[] {
    return this._threadTypeData.getValue();
  }

  private set threadTypeData(val: ThreadTypeData[]) {
    this._threadTypeData.next(val);
  }



  async updateRefType() {
    if (this.refType.length > 0) {
      return;
    }
    const res = await this.domainService.fetchRefType().toPromise();
    if (res.d.errId === '200') {
      this.refType = <RefType[]>res.d.refTypes;
    } else {
      console.log(res.d.errMsg);
    }
  }

  async updateRefTypeData(refId) {
    const res = await this.domainService.fetchRefTypeData(refId).toPromise();
    if (res.d.errId === '200') {
      this.refTypeData = <RefTypeData[]>res.d.refData;
    } else {
      console.log(res.d.errMsg);
    }
  }

  async updateThreadTypeData() {
    if (this.threadTypeData.length > 0) {
      return;
    }
    const res = await this.domainService.fetchThreadTypeData().toPromise();
    if (res.d.errId === '200') {
      const arrx = this.threadTypeData;
      arrx.push(...<ThreadTypeData[]>res.d.threadTypes);
      this.threadTypeData = arrx;
    } else {
      console.log(res.d.errMsg);
    }
  }

  async submitUnreadThreadData(mapTypes) {
    const res = await this.domainService.submitUnreadThreadData(mapTypes).toPromise();
    if (res.d.errId !== '200') {
      const modalRef = this.modalService.open(
        ErrorDialogComponent,
        { size: 'lg', backdrop: 'static', keyboard: false }
      );
      modalRef.componentInstance.res = res;
    }
  }


}
