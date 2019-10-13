import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})


export class TestComponent implements OnInit {

  editor_language:string='typescript';
  editorOptions:object = {theme: 'vs-dark', language: this.editor_language};
  code: string = '';

  constructor(private router: Router, private message: NzMessageService,
    private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    @Inject('DBG_BASE_URL') private dbg_base_url:string) {
  }

  ngOnInit() {
    
  }

}
