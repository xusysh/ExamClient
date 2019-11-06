import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { Router } from '@angular/router';

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

  exam_administration_drawer_visible:boolean = false;

  current_select_exam: number = 0;
  group_loading: boolean;
  all_group_info: Array<GroupInfo> = [];
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.group_id === o2.group_id : o1 === o2);
  compareFn_paper = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService, private router: Router) { }

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


  //删除单个试卷
  DeletePaper(index: number): void {
    this.current_select_exam = (this.page_index - 1) * this.page_size + index;
    let user_delete_info = {
      id: [this.exam_info_list[this.current_select_exam].id]
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: user_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'upi/user/multi', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '用户删除失败:' + response.msg);
        }
        else {
          this.message.create('success', '用户 ' + this.exam_info_list[this.current_select_exam].examName + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
      });
    this.drawer_visible = false;
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

  ParseDurationNum(duration:number):ShowTime {
    let show_time:ShowTime = {
      hour : Math.floor(duration / 3600000),
      minute  :Math.floor((duration / 60000) % 60),
      sec:Math.floor((duration / 1000) % 60)
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
    }
    this.UpdateGroupInfo(true);
    this.GetExamGroupStudents();
    this.drawer_visible = true;
  }

  EditExamInfo() {
    this.edit_exam_info_loading = true;
    this.GetDuration();
    let edit_exam_group_ids = [];
    for(let group of this.edit_exam_group) {
      edit_exam_group_ids.push(group.group_id)
    }
    let exam_begin_time_str = this.edit_exam_start_time.toLocaleString()
    exam_begin_time_str = exam_begin_time_str.substr(0,10).replace(new RegExp('/','g'),'-') + ' ' + this.edit_exam_start_time.toTimeString().substr(0,8);
    let exam_end_time_str = this.edit_exam_end_time.toLocaleString();
    exam_end_time_str = exam_end_time_str.substr(0,10).replace(new RegExp('/','g'),'-') + ' ' + this.edit_exam_end_time.toTimeString().substr(0,8);
    let edit_exam_info = {
      id:this.edit_exam_id,
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

  ExamAdministrationDrawerOpen() {
    
    this.exam_administration_drawer_visible = true;
  }

  test2(event:any) {
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

  DownloadTemplate(): void {
    this.is_downloading_template = true;
    this.http_client.get(this.base_url + 'upi/user/template', {
      responseType: 'arraybuffer'
    }
    ).subscribe(response => this.DownloadFile(response, "application/ms-excel"),
      error => {
        this.message.create('error', '文件下载失败：连接服务器失败');
        this.is_downloading_template = false;
      });
  }

  DownloadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "导入模板.xls";
    anchor.href = url;
    anchor.click();
    this.message.create('success', '文件下载成功');
    this.is_downloading_template = false;
  }

  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.set('files[]', item.file as any, 'files[]');
    const req = new HttpRequest('POST', item.action!, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http_client.request(req).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          item.onSuccess!(event.body, item.file!, event);
        }
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };

  customBigReq = (item: UploadXHRArgs) => {
    const size = item.file.size;
    const chunkSize = parseInt(size / 3 + '', 10);
    const maxChunk = Math.ceil(size / chunkSize);
    const reqs = Array(maxChunk)
      .fill(0)
      .map((_: {}, index: number) => {
        const start = index * chunkSize;
        let end = start + chunkSize;
        if (size - end < 0) {
          end = size;
        }
        const formData = new FormData();
        formData.append('file', item.file.slice(start, end));
        formData.append('start', start.toString());
        formData.append('end', end.toString());
        formData.append('index', index.toString());
        const req = new HttpRequest('POST', item.action!, formData, {
          withCredentials: true
        });
        return this.http_client.request(req);
      });
    return forkJoin(...reqs).subscribe(
      () => {
        item.onSuccess!({}, item.file!, event);
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
  };


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
  hour:number,
  minute:number,
  sec:number
}
