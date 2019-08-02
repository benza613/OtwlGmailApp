import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {
  public unreadFrom: string;
  public unreadTo: string;
  public unreadSubject: string;
  public mappedRefId: Number;
  public mappedRefValId: Number;
  public mappedFromDate: NgbDateStruct;
  public mappedToDate: NgbDateStruct;
  public tagsList;
  constructor() { }
}
