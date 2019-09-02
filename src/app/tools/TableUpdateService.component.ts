import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TableUpdateService {
  randomUserUrl = 'https://api.randomuser.me/';

  getUsers(
    pageIndex: number = 0,
    pageSize: number = 0,
    sortField: string,
    sortOrder: string,
    genders: string[]
  ): Observable<{}> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', sortField)
      .append('sortOrder', sortOrder);
    genders.forEach(gender => {
      params = params.append('gender', gender);
    });
    return this.http.get(`${this.randomUserUrl}`, {
      params
    });
  }

  UpdateValue(): Observable<{}>
  {
    return this.http.get(`${this.randomUserUrl}`, {
      });
  }

  constructor(private http: HttpClient) {}
}