import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-check-paper',
  templateUrl: './check-paper.component.html',
  styleUrls: ['./check-paper.component.css']
})

export class CheckPaperComponent implements OnInit {

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string, private message: NzMessageService) { 

  }

  ngOnInit(): void {
  }

  
}
