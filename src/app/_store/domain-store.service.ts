import { DomainService } from './../_http/domain.service';
import { Thread } from './../models/thread.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefType } from '../models/ref-type';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService
  ) { }

  private readonly _refType = new BehaviorSubject<RefType[]>([]);
  private readonly _refTypeData = new BehaviorSubject<Thread[]>([]);
  private readonly _partyTypeData = new BehaviorSubject<Thread[]>([]);

  readonly refType$ = this._refType.asObservable();
  readonly refTypeData$ = this._refTypeData.asObservable();
  readonly partyTypeData$ = this._partyTypeData.asObservable();

  private get refType(): RefType[] {
    return this._refType.getValue();
  }

  private set refType(val: RefType[]) {
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



  async updateRefType() {
    if (this.refType.length > 0) {
      return;
    }
    const res = await this.domainService.fetchRefType().toPromise();
    if (res.d.errId === '200') {
      const arrx = this.refType;
      
      arrx.push(...<RefType[]>res.d.refTypes);
      this.refType = arrx;
      console.log(this.refType);
    }
  }

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
