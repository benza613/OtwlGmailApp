import { Message } from './../models/message.model';
import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {
  public unreadFrom = '';
  public unreadTo = '';
  public unreadSubject = '';
  public sentTo: string;
  public sentFrom: string;
  public sentSubject: string;
  public mappedRefId: Number;
  public mappedRefValId: Number;
  public mappedFromDate: NgbDateStruct;
  public mappedToDate: NgbDateStruct;
  public tagsList;
  public email_body;
  public isAdmin = 0;
  public emailAttach: Message[] = null;
  public subject = '';
  constructor() { }
}
