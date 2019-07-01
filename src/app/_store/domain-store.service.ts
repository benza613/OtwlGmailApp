import { ErrorService } from './../error/error.service';
import { DomainService } from './../_http/domain.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefType } from '../models/ref-type';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService,
    private modalService: NgbModal,
    private erorService: ErrorService
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



  updateRefType() {
    return new Promise(async (res, rej) => {
      if (this.refType.length > 0) {
        return;
      }
      const result = await this.domainService.fetchRefType().toPromise();
      if (result.d.errId === '200') {
        this.refType = <RefType[]>result.d.refTypes;
        res(result.d.errId);
      } else {
        this.erorService.displayError(result, 'fetchRefType');
        rej();
      }
    });
  }

  updateRefTypeData(refId) {
    return new Promise(async (res, rej) => {
      const result = await this.domainService.fetchRefTypeData(refId).toPromise();
      if (result.d.errId === '200') {
        this.refTypeData = <RefTypeData[]>result.d.refData;
        res(result.d.errId);
      } else {
        this.erorService.displayError(result, 'fetchRefTypeData');
        rej();
      }
    });
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
      this.erorService.displayError(res, 'fetchThreadTypeData');
    }
  }

  deleteMapping(threadUID, threadGID) {
    return new Promise(async (res, rej) => {
      const result = await this.domainService.deleteThreadMapping(threadUID, threadGID).toPromise();
      if (result.d.errId === '200') {
        res(result.d.errId);
      } else {
        this.erorService.displayError(res, 'deleteMapping');
        rej();
      }
    });
  }

  submitUnreadThreadData(mapTypes) {
    return new Promise(async (res, rej) => {
      const result = await this.domainService.submitUnreadThreadData(mapTypes).toPromise();
      if (result.d.errId === '200') {
        res(result.d.errId);
      } else {
        this.erorService.displayError(result, 'submitUnreadThreadData');
        rej();
      }
    });
  }


}
