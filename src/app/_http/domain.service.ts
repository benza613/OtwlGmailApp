import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  fetchRefTypes() {
    // return this.http.post(`${this.apiBaseUrl}/`, this.httpOptions)
    // .pipe(map(r => r));
  }

  fetchRefData() {
    // return this.http.post(`${this.apiBaseUrl}/`, this.httpOptions)
    // .pipe(map(r => r));
  }

  fetchPartyType() {
    // return this.http.post(`${this.apiBaseUrl}/`, this.httpOptions)
    // .pipe(map(r => r));
  }
}
