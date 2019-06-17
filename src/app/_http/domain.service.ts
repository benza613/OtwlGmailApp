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

  // fetchRefTypeData(): Observable<any>  {
  //   return this.http.post(`${this.apiBaseUrl}/`, this.httpOptions)
  //   .pipe(map(r => r));
  // }

  // fetchPartyTypeData(): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/`, this.httpOptions)
  //   .pipe(map(r => r));
  // }
}
