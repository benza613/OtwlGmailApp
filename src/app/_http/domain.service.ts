import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  private readonly apiBaseUrl = env.url.server;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  };

  fetchRefType(): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getDomainRefTypes`, {}, this.httpOptions)
      .pipe(map(r => r));
  }

  fetchRefTypeData(typeId): Observable<any>  {
    return this.http.post(`${this.apiBaseUrl}/getDomainRefValues`, {typeId} , this.httpOptions)
    .pipe(map(r => r));
  }

  fetchThreadTypeData(): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/getDomainMailTypes`, {}, this.httpOptions)
    .pipe(map(r => r));
  }

  submitUnreadThreadData(mapTypes) {
    return this.http.post(`${this.apiBaseUrl}/insertThreadDomainMapping`, {mapTypes}, this.httpOptions)
    .pipe(map(r => r));
  }
}
