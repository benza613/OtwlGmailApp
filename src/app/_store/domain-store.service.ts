import { DomainService } from './../_http/domain.service';
import { Thread } from './../models/thread.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainStoreService {

  constructor(
    private domainService: DomainService
  ) { }

  private readonly _refTypes = [];
  private readonly _refData = [];
  private readonly _partyType = [];

  private get refTypes(): Thread[] {
    //return this.domainService.method()
  }

  private set refTypes(val) {
    // this._refTypes = val;
  }

  private get refData(): Thread[] {
    //return this.domainService.method()
  }

  private set refData(val) {
    // this._refTypes = val;
  }

  private get partyType(): Thread[] {
   //return this.domainService.method()
  }

  private set partyType(val) {
    // this._refTypes = val;
  }
}
