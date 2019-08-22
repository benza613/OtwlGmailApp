import { ErrorService } from './../error/error.service';
import { DomainService } from './../_http/domain.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefType } from '../models/ref-type';
import { RefTypeData } from '../models/ref-type-data';
import { ThreadTypeData } from '../models/thread-type-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FSDirList } from '../models/fsdir-list.model';
import { FilesList } from '../models/files-list.model';

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
  private readonly _fsTags = new BehaviorSubject<ThreadTypeData[]>([]);
  private readonly _fsDirData = new BehaviorSubject<FSDirList[]>([]);
  private readonly _filesList = new BehaviorSubject<FilesList[]>([]);

  readonly refType$ = this._refType.asObservable();
  readonly refTypeData$ = this._refTypeData.asObservable();
  readonly threadTypeData$ = this._threadTypeData.asObservable();
  readonly fsTags$ = this._fsTags.asObservable();
  readonly fsDirData$ = this._fsDirData.asObservable();
  readonly filesList$ = this._filesList.asObservable();

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

  private get fsTags(): ThreadTypeData[] {
    return this._fsTags.getValue();
  }

  private set fsTags(val: ThreadTypeData[]) {
    this._fsTags.next(val);
  }

  private get fsDirData(): FSDirList[] {
    return this._fsDirData.getValue();
  }

  private set fsDirData(val: FSDirList[]) {
    this._fsDirData.next(val);
  }

  private get filesList(): FilesList[] {
    return this._filesList.getValue();
  }

  private set filesList(val: FilesList[]) {
    this._filesList.next(val);
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

  async updateFSTags() {
    if (this.fsTags.length > 0) {
      return;
    }
    const res = await this.domainService.fetchFSTags().toPromise();
    if (res.d.errId === '200') {
      const arrx = this.fsTags;
      arrx.push(...<ThreadTypeData[]>res.d.threadTypes);
      this.fsTags = arrx;
      console.log(this.fsTags);
    } else {
      this.erorService.displayError(res, 'fetchThreadTypeData');
    }
  }

  async updateFSDirList() {
    if (this.fsDirData.length > 0) {
      return;
    }
    const res = await this.domainService.fetchFSDirList().toPromise();
    if (res.d.errId === '200') {
      const arrx = this.fsDirData;
      arrx.push(...<FSDirList[]>res.d.fsList);
      this.fsDirData = arrx;
    } else {
      this.erorService.displayError(res, 'fetchThreadTypeData');
    }
  }

  async updateFilesList(dirId) {
    const res = await this.domainService.fetchFiles(dirId).toPromise();
    if (res.d.errId === '200') {
      this.filesList = [];
      const arrx = this.filesList;
      arrx.push(...<FilesList[]>res.d.files);
      this.filesList = arrx;
    } else {
      this.erorService.displayError(res, 'fetchThreadTypeData');
    }
  }
}
