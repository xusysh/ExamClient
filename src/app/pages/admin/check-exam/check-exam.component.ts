import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { Router } from '@angular/router';
import { FilterSortService } from 'src/app/tools/FilterSortService.component';

@Component({
  selector: 'app-check-exam',
  templateUrl: './check-exam.component.html',
  styleUrls: ['./check-exam.component.css']
})

export class CheckExamComponent implements OnInit {


  public page_index: number = 1;
  public page_size: number = 5;
  public listOfData: Array<object> = [];
  public loading: boolean = true;
  public sortValue: string | null = null;
  public sortKey: string | null = null;
  public searchGenderList: string[] = [];
  public is_downloading_template = false;
  public exam_info_list: Array<ExamInfo> = [];
  exam_info_list_backup:Array<ExamInfo> = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public is_allDisplay_data_checked = false;
  public is_indeterminate = false;

  public edit_exam_info_loading = false;
  public edit_exam_id: number = 0;
  public edit_exam_name: string = '';
  public edit_exam_paper_info: PaperBaseInfo = null;
  public edit_exam_student: Array<any> = null;
  public edit_exam_group: Array<GroupInfo> = null;
  public edit_exam_start_time: Date = null;
  public edit_exam_end_time: Date = null;
  public edit_exam_duration: number = 0;
  public edit_exam_hour: number = 0;
  public edit_exam_minute: number = 0;
  public edit_exam_second: number = 0;

  public all_paper_info: Array<PaperBaseInfo> = [];
  public all_paper_info_loading: boolean = false;
  public group_info_loading: boolean = false;

  exam_administration_drawer_visible: boolean = false;
  exam_administration_page_index = 1;
  exam_administration_page_size = 5;
  exam_student_paper_info_list: Array<StudentPaperBaseInfo> = []
  exam_administration_loading: boolean = false;

  judge_objective_loading: boolean = false;

  current_select_exam: number = 0;
  group_loading: boolean;
  all_group_info: Array<GroupInfo> = [];

  delete_exam_ids: Array<number> = [];
  delete_loading: boolean = false;
  end_exam_loading: boolean = false;

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.group_id === o2.group_id : o1 === o2);
  compareFn_paper = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  status_filter: { text: string; value: string; }[];
  status_selected_filter_val: any;
  search_exam_name_value: any;
  begin_time_sort_value: any;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService, private router: Router,
    private filter_sort_service:FilterSortService) { }

  ngOnInit(): void {
    this.UpdateTableData();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
  }

  UpdateTableData(reset: boolean = false): void {
    if (reset) {
      this.page_index = 1;
    }
    this.loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'epi/admin/examlist').subscribe(
      response => {
        this.exam_info_list = response.data;
        for (let exam of this.exam_info_list) {
          exam['delete_flag'] = false;
        }
        this.exam_info_list_backup = Array.from(this.exam_info_list);
        this.ResetArrayData();
        this.loading = false;
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


  //删除单个考试
  DeleteExam(index: number): void {
    this.current_select_exam = (this.page_index - 1) * this.page_size + index;
    let exam_delete_info = {
      exam_id: [this.exam_info_list[this.current_select_exam].id]
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: exam_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'exam/del', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '考试删除失败:' + response.msg);
        }
        else {
          this.message.create('success', '考试 ' + this.exam_info_list[this.current_select_exam].examName + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '考试删除失败：连接服务器失败');
      });
  }

  //批量删除考试
  DeleteExams() {
    this.delete_loading = true;
    let exam_delete_info = {
      exam_id: this.delete_exam_ids
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: exam_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'exam/del', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '考试删除失败:' + response.msg);
          this.delete_loading = false;
        }
        else {
          this.message.create('success', '考试删除成功');
          this.delete_loading = false;
          this.delete_exam_ids = [];
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '考试删除失败：连接服务器失败');
        this.delete_loading = false;
      });
  }

  RefreshDeleteCheckStatus(checked: boolean): void {
    this.delete_exam_ids = []
    for (let exam of this.exam_info_list) {
      if (exam['delete_flag'] == true) {
        this.delete_exam_ids.push(exam.id);
      }
    }
  }


  GroupSelectOpened(opened: boolean) {
    if (opened) {
      this.group_loading = true;
      this.UpdateGroupInfo();
      this.group_loading = false;
    }
  }

  DrawerClose(): void {
    this.drawer_visible = false;
  }

  ParseDuration() {
    this.edit_exam_hour = Math.floor(this.edit_exam_duration / 3600000);
    this.edit_exam_minute = Math.floor((this.edit_exam_duration / 60000) % 60);
    this.edit_exam_second = Math.floor((this.edit_exam_duration / 1000) % 60);
  }

  ParseDurationNum(duration: number): ShowTime {
    let show_time: ShowTime = {
      hour: Math.floor(duration / 3600000),
      minute: Math.floor((duration / 60000) % 60),
      sec: Math.floor((duration / 1000) % 60)
    }
    return show_time;
  }

  GetDuration() {
    this.edit_exam_duration = 0;
    this.edit_exam_duration += this.edit_exam_hour * 3600000;
    this.edit_exam_duration += this.edit_exam_minute * 60000;
    this.edit_exam_duration += this.edit_exam_second * 1000;
  }

  AddExam() {

  }

  EditExam(index: number): void {
    if (index == -1) {
      this.edit_exam_id = null;
    }
    else {
      this.current_select_exam = (this.page_index - 1) * this.page_size + index;
      this.edit_exam_paper_info = this.exam_info_list[this.current_select_exam].paper_info;
      this.edit_exam_id = this.exam_info_list[this.current_select_exam].id;
      this.edit_exam_name = this.exam_info_list[this.current_select_exam].examName;
      this.edit_exam_start_time = new Date(Date.parse(this.exam_info_list[this.current_select_exam].beginTime));
      this.edit_exam_end_time = new Date(Date.parse(this.exam_info_list[this.current_select_exam].endTime));
      this.edit_exam_duration = this.exam_info_list[this.current_select_exam].duration;
      this.ParseDuration();
      this.GetExamGroupStudents();
    }
    this.UpdateGroupInfo(true);
    this.drawer_visible = true;
  }

  EditExamInfo() {
    this.edit_exam_info_loading = true;
    this.GetDuration();
    let edit_exam_group_ids = [];
    for (let group of this.edit_exam_group) {
      edit_exam_group_ids.push(group.group_id)
    }
    let exam_begin_time_str = this.getNowFormatDate(this.edit_exam_start_time);
    let exam_end_time_str = this.getNowFormatDate(this.edit_exam_end_time);
    let edit_exam_info = {
      id: this.edit_exam_id,
      exam_name: this.edit_exam_name,
      paper_code: this.edit_exam_paper_info.paperCode,
      begin_time: exam_begin_time_str,
      end_time: exam_end_time_str,
      duration: this.edit_exam_duration,
      status: "未开始",
      group_ids: edit_exam_group_ids
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'exam/new', edit_exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '编辑试卷失败:' + response.msg);
          this.edit_exam_info_loading = false;
        }
        else {
          this.message.create('success', '编辑试卷成功');
          this.edit_exam_group = response.data;
          this.edit_exam_info_loading = false;
          this.drawer_visible = false;
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '编辑试卷失败：连接服务器失败');
        this.edit_exam_info_loading = false;
      });
  }

  ExamAdministrationDrawerOpen(index: number) {
    this.current_select_exam = (this.page_index - 1) * this.page_size + index;
    this.exam_administration_drawer_visible = true;
    this.UpdateStudentPaperInfo();
  }

  test2(event: any) {
    console.log(this.edit_exam_paper_info)
  }

  GetExamGroupStudents() {
    let exam_info = {
      exam_id: this.exam_info_list[this.current_select_exam].id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'paper/student', exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '获取试卷考生组信息失败:' + response.msg);
        }
        else {
          this.edit_exam_group = response.data;
        }
      }, error => {
        this.message.create('error', '获取试卷考生组信息失败：连接服务器失败');
      });
  }

  UpdateGroupInfo(is_open: boolean = false) {
    if (!is_open) return;
    this.group_info_loading = true;
    this.all_group_info = []
    this.http_client.get<MyServerResponse>(this.base_url + 'upi/groupuser/all').subscribe(
      response => {
        this.all_group_info = response.data;
      },
      error => {
        this.message.create('error', '组信息获取失败：连接服务器失败');
      });
  }

  UpdatePaperInfo(is_open: boolean = true) {
    if (!is_open) return;
    this.all_paper_info_loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'paper/all').subscribe(
      response => {
        this.all_paper_info = response.data;
        this.all_paper_info_loading = false;
      },
      error => {
        this.message.create('error', '试卷信息获取失败：连接服务器失败');
        this.all_paper_info_loading = false;
      });
  }

  UpdateStudentPaperInfo(reset: boolean = false) {
    if (reset) {
      this.page_index = 1;
    }
    this.exam_student_paper_info_list = [];
    this.exam_administration_loading = true;
    let exam_id = {
      exam_id: this.exam_info_list[this.current_select_exam].id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/stupoint', exam_id).subscribe(
      response => {
        if (response.status != 200) {
          this.exam_administration_loading = false;
          this.message.create('info', '考试信息获取失败：' + response.msg);
          return;
        }
        this.exam_student_paper_info_list = response.data;
        this.exam_administration_loading = false;
        this.message.create('success', '考试信息获取成功');
      },
      error => {
        this.message.create('error', '考试信息获取失败：连接服务器失败');
        this.exam_administration_loading = false;
      });
  }

  JudgeObjective() {
    this.judge_objective_loading = true;
    let exam_id = {
      exam_id: this.exam_info_list[this.current_select_exam].id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'spi/startobj', exam_id).subscribe(
      response => {
        if (response.status != 200) {
          this.message.create('info', '系统客观题自动判题失败：' + response.msg);
          this.judge_objective_loading = false;
          return;
        }
        this.message.create('success', '系统客观题自动判题成功');
        this.judge_objective_loading = false;
        this.UpdateStudentPaperInfo();
      },
      error => {
        this.message.create('error', '系统客观题自动判题失败：连接服务器失败');
        this.judge_objective_loading = false;
      });
  }

  JudgePaper(index: number) {
    let judge_exam = (this.exam_administration_page_index - 1) * this.exam_administration_page_size + index;
    let judge_exam_id = this.exam_student_paper_info_list[judge_exam].examId;
    let judge_student_id = this.exam_student_paper_info_list[judge_exam].studentId;
    sessionStorage.setItem('judge_exam_id', judge_exam_id.toString());
    sessionStorage.setItem('judge_student_id', judge_student_id.toString());
    this.router.navigateByUrl("/admin/judge-paper");
  }

  CheckExamPaper(index: number) {
    let judge_exam = (this.exam_administration_page_index - 1) * this.exam_administration_page_size + index;
    let judge_exam_id = this.exam_student_paper_info_list[judge_exam].examId;
    let judge_student_id = this.exam_student_paper_info_list[judge_exam].studentId;
    sessionStorage.setItem('judge_exam_id', judge_exam_id.toString());
    sessionStorage.setItem('judge_student_id', judge_student_id.toString());
    this.router.navigateByUrl("/admin/check-exam-paper");
  }


  DialogOKHandle(): void {
    this.dialog_ok_loading = true;
    this.UpdateTableData();
    setTimeout(() => {
      this.dialog_visible = false;
      this.dialog_ok_loading = false;
    }, 2000);
  }

  DialogCancelHandle(): void {
    this.dialog_visible = false;
  }

  refreshStatus(): void {
  }

  EndExam() {
    this.end_exam_loading = true;
    let exam_info = {
      exam_id: this.exam_info_list[this.current_select_exam].id
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'exam/techend', exam_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '结束考试失败:' + response.msg);
          this.end_exam_loading = false;
        }
        else {
          this.message.create('success', '结束考试成功:');
          this.end_exam_loading = false;
          this.UpdateTableData();
          this.UpdateStudentPaperInfo();
        }
      }, error => {
        this.message.create('error', '结束考试失败：连接服务器失败');
        this.end_exam_loading = false;
      });
  }

  getNowFormatDate(date: Date): string {
    let seperator1 = "-";
    let seperator2 = ":";
    let month = getNewDate(date.getMonth() + 1);
    let day = getNewDate(date.getDate());
    let hours = getNewDate(date.getHours());
    let minutes = getNewDate(date.getMinutes());
    let seconds = getNewDate(date.getSeconds());
    //统一格式为两位数
    function getNewDate(date) {
      if (date <= 9) {
        date = "0" + date;
      }
      return date;
    }

    let currentDate = date.getFullYear() + seperator1 + month + seperator1 + day
      + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentDate;
  }


  ResetArrayData() {
    this.status_filter = [
      { text: '未开始', value: '未开始' }, 
      { text: '进行中', value: '进行中' },
      { text: '判卷中', value: '判卷中' },
      { text: '已结束', value: '已结束' }
    ];
    this.ResetSearch();
    this.ResetSort();
    this.exam_info_list = Array.from(this.exam_info_list_backup);
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
    this.exam_info_list = this.filter_sort_service.GetFilteredArray(this.exam_info_list,this.status_selected_filter_val,'status');
  }

  SearchNameInArray() {
    this.exam_info_list = this.filter_sort_service.GetSearchedArray(this.exam_info_list,this.search_exam_name_value,'examName');
  }

  ResetSearch() {
    this.search_exam_name_value = "";
  }

  TimeSortStatusChanged() {
  //  console.log(this.begin_time_sort_value)
    if(this.begin_time_sort_value == null) {
      this.ResetArrayData();
      return;
    }
    this.UpdateSortedData();
  }

  UpdateSortedData() {
    let insc = this.begin_time_sort_value == 'ascend'?true:false;
    this.exam_info_list = this.filter_sort_service.GetSortedDateTimeStrArray(this.exam_info_list,'beginTime',insc);
    //改变对象的句柄/引用，不然表格不会更新
    this.exam_info_list = Array.from(this.exam_info_list);
  }

  ResetSort() {
    this.begin_time_sort_value = null;
  }

}

interface ExamInfo {
  id: number,
  examName: string,
  paper_info: PaperBaseInfo,
  beginTime: string,
  endTime: string,
  duration: number,
  status: string
}

interface PaperBaseInfo {
  id: number,
  paperCode: string,
  createTime: string,
  lastModifiedTime: string,
  createUserId: number,
  title: string,
  description: string
}

interface GroupInfo {
  group_id: number,
  group_name: string,
  students: Array<StudentInfo>
}

interface StudentInfo {
  id: number,
  user_name: string,
}

interface ShowTime {
  hour: number,
  minute: number,
  sec: number
}

interface StudentPaperBaseInfo {
  id: 8,
  paperCode: string,
  studentId: number,
  objectiveGrade: number,
  subjectiveGrade: number,
  extraPoint: number,
  paperTotalPoint: number,
  studentTotalPoint: number,
  objectiveStatus: number,
  subjectiveStatus: number,
  examId: number,
  endFlag: number,
  inTime: number,
  leftTime: number,
  studentName: string
}