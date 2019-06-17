import { DomainService } from './../_http/domain.service';
import { Thread } from './../models/thread.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService
  ) { }

  private readonly _refType = new BehaviorSubject<Thread[]>([]);
  private readonly _refTypeData = new BehaviorSubject<Thread[]>([]);
  private readonly _partyTypeData = new BehaviorSubject<Thread[]>([]);

  readonly refType$ = this._refType.asObservable();
  readonly refTypeData$ = this._refTypeData.asObservable();
  readonly partyTypeData$ = this._partyTypeData.asObservable();

  private get refTypes(): Thread[] {
    return this._refType.getValue();
  }

  private set refTypes(val: Thread[]) {
    this._refType.next(val);
  }

  private get refTypeData(): Thread[] {
    return this._refTypeData.getValue();
  }

  private set refTypeData(val: Thread[]) {
    this._refTypeData.next(val);
  }

  private get partyTypeData(): Thread[] {
     return this._partyTypeData.getValue();
  }

  private set partyTypeData(val: Thread[]) {
    this._partyTypeData.next(val);
  }



  // async updateRefType() {
  //   if (this.refTypes.length > 0) {
  //     return;
  //    }
  //   const res = await this.domainService.fetchRefTypes().toPromise();
  //   if (res.d.errId === '200') {
  //     const arrx = this.refTypes;
  //     arrx.push(...<Thread[]>res.d.threads);
  //     this.refTypes = arrx;
  //   }
  // }

  // async updateRefTypeData() {
  //   if (this.refTypeData.length > 0) {
  //     return;
  //   }
  //   const res = await this.domainService.fetchRefTypeData().toPromise();
  //   if (res.d.errId === '200') {
  //     const arrx = this.refTypeData;
  //     arrx.push(...<Thread[]>res.d.threads);
  //     this.refTypeData = arrx;
  //   }
  // }

  // async updatePartyTypeData() {
  //   if (this.partyTypeData.length > 0) {
  //     return;
  //   }
  //   const res = await this.domainService.fetchPartyTypeData().toPromise();
  //   if (res.d.errId === '200') {
  //     const arrx = this.partyTypeData;
  //     arrx.push(...<Thread[]>res.d.threads);
  //     this.partyTypeData = arrx;
  //   }
  // }
}
