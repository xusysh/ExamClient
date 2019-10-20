import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin, from } from 'rxjs';
import { MyServerResponse } from '../../login/login.component'

@Component({
  selector: 'app-check-question',
  templateUrl: './check-question.component.html',
  styleUrls: ['./check-question.component.css']
})

export class CheckQuestionComponent implements OnInit {

  public page_index: number = 1;
  public page_size: number = 5;
  public listOfData: Array<object> = [];
  public loading: boolean = true;
  public sortValue: string | null = null;
  public sortKey: string | null = null;
  public searchGenderList: string[] = [];
  public is_downloading_template = false;
  public question_info_list: Array<QuestionInfo> = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public is_allDisplay_data_checked = false;
  public is_indeterminate = false;
  public edit_user_id: number = 0;
  public edit_user_name: string = '';
  public edit_password: string = '';
  public edit_group_list: Array<object> = [];

  public user_group_tags = [];
  public inputVisible = false;
  public inputValue = '';
  public edit_user_info_loading = false;

  current_select_user: number = 0;


  //假数据
  public users_group_list = [['产品开发科', '招投标项目组', '考试系统小组'], ['需求分析科'], ['产品开发科', '人工智能小组'],
  ['鑫源融信公司', '招投标项目组'], ['运营支持科', '考试系统小组', '微服务小组']];

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService) { }

  ngOnInit(): void {
    this.UpdateTableData();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.UpdateTableData();
  }

  UpdateTableData(reset: boolean = false): void {
    if (reset) {
      this.page_index = 1;
    }
    this.loading = true;
    this.http_client.get<MyServerResponse>(this.base_url + 'upi/usergroup/all').subscribe(
      response => {
        this.question_info_list = response.data;
        this.loading = false;
      },
      error => {
        this.message.create('error', '用户信息获取失败：连接服务器失败');
        this.loading = false;
      });

  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  CheckStudentInfo(index: number): void {
    this.current_select_user = (this.page_index - 1) * this.page_size + index;
    this.drawer_visible = true;
  }

  EditUserInfo(): void {
    this.edit_user_info_loading = true;
    this.edit_user_id = this.question_info_list[this.current_select_user].id;
    let user_edit_info: UserEditInfo = {
      id: this.edit_user_id,
      userName: this.edit_user_name,
      password: this.edit_password,
      userType: this.question_info_list[this.current_select_user].type,
      group_add: [],
      group_del: []
    }
    this.http_client.post<MyServerResponse>(this.base_url + '/upi/usergroup/relation', user_edit_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '用户编辑失败:' + response.msg);
        }
        else {
          this.message.create('success', '用户 ' + this.edit_user_name + ' 编辑成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户编辑失败：连接服务器失败');
      });
    this.edit_user_info_loading = false;
    this.drawer_visible = false;
  }

  //删除单个用户
  DeleteUser(index: number): void {
    this.current_select_user = (this.page_index - 1) * this.page_size + index;
    let user_delete_info = {
      id: [this.question_info_list[this.current_select_user].id]
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
      //    this.message.create('success', '用户 ' + this.question_info_list[this.current_select_user].userName + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
      });
    this.drawer_visible = false;
  }

  AddStudentInfo(): void {
    this.drawer_visible = true;
    this.edit_user_id = 0;
    this.edit_user_name = '';
    this.edit_password = '';
    this.edit_group_list = null;
  }

  DrawerClose(): void {
    this.drawer_visible = false;
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

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.user_group_tags.indexOf(this.inputValue) === -1) {
      this.user_group_tags = [...this.user_group_tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  DownloadTemplate(): void {
    this.is_downloading_template = true;
    this.http_client.post(this.base_url + 'upi/user/template', null, {
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

interface QuestionInfo {
  id: number,
  content: string,
  type: string,
  description: string,
  answer:Array<object>,
  options: Array<Option>
}

interface Option {
  id: number,
  option: string
}

interface UserEditInfo {
  id: number,
  userName: string,
  password: string,
  userType: string,
  group_add: Array<number>,
  group_del: Array<number>
}