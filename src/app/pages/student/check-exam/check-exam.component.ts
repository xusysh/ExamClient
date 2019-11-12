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
  page_index = 1;
  page_size = 5;
  listOfData = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  filterGender = [{ text: 'male', value: 'male' }, { text: 'female', value: 'female' }];
  searchGenderList: string[] = [];

  current_select_exam:number = 0;

  status_filter = [
    { text: '未开始', value: '未开始' }, 
    { text: '进行中', value: '进行中' },
    { text: '判卷中', value: '判卷中' },
    { text: '已结束', value: '已结束' }
  ];

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
      this.page_index = 1;
    }
    this.loading = true;
    let student_id = {
      user_id:sessionStorage.getItem('userid')
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

  ParseDurationNum(duration:number):ShowTime {
    let show_time:ShowTime = {
      hour : Math.floor(duration / 3600000),
      minute  :Math.floor((duration / 60000) % 60),
      sec:Math.floor((duration / 1000) % 60)
    }
    return show_time;
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  EnterExam(index:number) {
    this.current_select_exam =  (this.page_index - 1) * this.page_size + index;
    let current_exam = this.student_exam_info_list[this.current_select_exam];
    sessionStorage.setItem('exam_id',current_exam.id.toString())
    sessionStorage.setItem('paper_code',current_exam.paperCode)
    this.router.navigateByUrl("/student/examination");
  }

  ngOnInit(): void {
    this.UpdateTableData();
  }

  StatusFilterChange(filter) {
    console.log(filter);
    //todo
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

interface ShowTime {
  hour:number,
  minute:number,
  sec:number
}
