import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { MyServerResponse } from '../../login/login.component';

@Component({
  selector: 'app-check-exam',
  templateUrl: './check-exam.component.html',
  styleUrls: ['./check-exam.component.css']
})

export class CheckExamComponent implements OnInit {
  pageIndex = 1;
  pageSize = 5;
  listOfData = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  filterGender = [{ text: 'male', value: 'male' }, { text: 'female', value: 'female' }];
  searchGenderList: string[] = [];

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
  }

  public student_exam_info_list:Array<StudentExamInfo> = []

  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService, private router: Router) { 
    }

  UpdateTableData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    let student_id = {
      user_id:10
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'epi/user/examlist',student_id).subscribe(
      response => {
        this.student_exam_info_list = response.data;
        this.loading = false;
        this.message.create('success', '考试信息获取成功');
      },
      error => {
        this.message.create('error', '考试信息获取失败：连接服务器失败');
        this.loading = false;
      });
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  ngOnInit(): void {
    this.UpdateTableData();
  }

}

interface StudentExamInfo {
  id: number,
  examName: string,
  paperCode: string,
  beginTime: string,
  endTime: string,
  duration: number,
  status: string
}