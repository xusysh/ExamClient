import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-judge-paper',
  templateUrl: './judge-paper.component.html',
  styleUrls: ['./judge-paper.component.css']
})

export class JudgePaperComponent implements OnInit {

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string, private message: NzMessageService) { 

  }

  ngOnInit(): void {
  }

  
}
