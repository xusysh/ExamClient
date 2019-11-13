import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { MyServerResponse } from '../../login/login.component';
import { FilterSortService } from 'src/app/tools/FilterSortService.component';

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

  current_select_exam:number = 0;

  status_filter = [
    { text: '未开始', value: '未开始' }, 
    { text: '进行中', value: '进行中' },
    { text: '判卷中', value: '判卷中' },
    { text: '已结束', value: '已结束' }
  ];

  status_selected_filter_val = [];
  search_exam_name_value = "";

  public student_exam_info_list:Array<StudentExamInfo> = []
  public student_exam_info_list_backup:Array<StudentExamInfo> = []

  constructor(private filter_sort_service: FilterSortService, private http_client: HttpClient,
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
        this.student_exam_info_list_backup = response.data;
        this.ResetArrayData();
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

  ResetArrayData() {
    this.status_filter = [
      { text: '未开始', value: '未开始' }, 
      { text: '进行中', value: '进行中' },
      { text: '判卷中', value: '判卷中' },
      { text: '已结束', value: '已结束' }
    ];
    this.ResetSearch();
  }

  StatusFilterChange(filter) {
    this.status_selected_filter_val = filter;
    this.UpdateFilteredData();
  }

  UpdateFilteredData() {
    if(this.status_selected_filter_val.length == 0) {
      this.ResetArrayData();
      return;
    }
    this.student_exam_info_list = this.filter_sort_service.GetFilteredArray(this.student_exam_info_list,this.status_selected_filter_val,'status');
  }

  SearchNameInArray() {
    if(this.search_exam_name_value == null||this.search_exam_name_value == "") {
      this.ResetArrayData();
      return;
    }
    this.student_exam_info_list = this.filter_sort_service.GetSearchedArray(this.student_exam_info_list,this.search_exam_name_value,'examName');
  }

  ResetSearch() {
    this.search_exam_name_value = "";
    this.student_exam_info_list = this.student_exam_info_list_backup;
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
