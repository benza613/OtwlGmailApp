import { DomainService } from './../_http/domain.service';
import { Thread } from './../models/thread.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefType } from '../models/ref-type';
import { RefTypeData } from '../models/ref-type-data';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService
  ) { }

  private readonly _refType = new BehaviorSubject<RefType[]>([]);
  private readonly _refTypeData = new BehaviorSubject<RefTypeData[]>([]);
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

  private get refTypeData(): RefTypeData[] {
    return this._refTypeData.getValue();
  }

  private set refTypeData(val: RefTypeData[]) {
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

  async updateRefTypeData(typeId) {
    const res = await this.domainService.fetchRefTypeData(typeId).toPromise();
    if (res.d.errId === '200') {
      const arrx = this.refTypeData;
      console.log(res.d);
      
      arrx.push(...<RefTypeData[]>res.d.refData);
      this.refTypeData = arrx;
    } else {
      console.log(res.d.errId);
    }
  }

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
