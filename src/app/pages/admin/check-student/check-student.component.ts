import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';

@Component({
  selector: 'app-check-student',
  templateUrl: './check-student.component.html',
  styleUrls: ['./check-student.component.css']
})

export class CheckStudentComponent implements OnInit {

  public page_index: number = 1;
  public page_size: number = 5;
  public listOfData: Array<object> = [];
  public loading: boolean = true;
  public sortValue: string | null = null;
  public sortKey: string | null = null;
  public searchGenderList: string[] = [];
  public is_downloading_template = false;
  public student_info_list: Array<UserInfo> = [];
  public all_studnets: Array<object> = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public is_allDisplay_data_checked = false;
  public is_indeterminate = false;
  public edit_user_id: number = 0;
  public edit_user_name: string = '';
  public edit_password: string = '';
  public edit_group_list: Array<object> = [];
  public edit_group_student_list: Array<Array<object>> = [];
  public edit_group_student_list_loading: boolean = false;

  public user_group_tags = [];
  public inputVisible = false;
  public inputValue = '';
  public edit_user_info_loading = false;
  public group_info_loading = false;

  delete_student_ids:Array<number> = [];
  delete_loading:boolean = false;

  edit_group_name_flags: Array<boolean> = [];
  edit_group_name: string = '';

  current_select_user: number = 0;
  user_group_loading: boolean;
  all_group_info: Array<GroupInfo> = [];
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.group_id === o2.group_id : o1 === o2);
  compareFn_stu = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService) { }

  ngOnInit(): void {
    this.UpdateTableData();
    this.UpdateGroupInfo();
  }

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
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
        this.student_info_list = response.data;
        for(var student of this.student_info_list) 
          student['delete_flag'] = false;
        this.GetAllStudents();
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
    if (index == -1) {
      this.edit_user_id = 0;
      this.edit_user_name = '';
      this.edit_password = '';
      this.edit_group_list = null;
    }
    else {
      this.current_select_user = (this.page_index - 1) * this.page_size + index;
      this.edit_user_id = this.student_info_list[this.current_select_user].id;
      this.edit_user_name = this.student_info_list[this.current_select_user].userName;
      this.edit_password = this.student_info_list[this.current_select_user].password;
      this.edit_group_list = this.student_info_list[this.current_select_user].group_list;
    }
    this.drawer_visible = true;
    //    this.edit_group_list = JSON.parse(JSON.stringify(this.edit_group_list).replace(/id/g,"group_id"));
    //  this.edit_group_list = JSON.parse(JSON.stringify(this.edit_group_list).replace(/groupName/g,"group_name"));
  }

  EditUserInfo(): void {
    if (this.edit_user_name == '' || this.edit_user_name == null) {
      this.edit_user_name = '';
      return;
    }
    if (this.edit_password == '' || this.edit_password == null) {
      this.edit_password = '';
      return;
    }
    this.edit_user_info_loading = true;
    let user_edit_info: UserEditInfo = {
      id: this.edit_user_id,
      userName: this.edit_user_name,
      password: this.edit_password,
      userType: 'student',
      group_list: this.edit_group_list
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
      id: [this.student_info_list[this.current_select_user].id]
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
          this.message.create('success', '用户 ' + this.student_info_list[this.current_select_user].userName + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
      });
  }

  //批量删除用户
  DeleteUsers() {
    this.delete_loading = true;
    let user_delete_info = {
      id: this.delete_student_ids
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: user_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'upi/user/multi', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '用户删除失败:' + response.msg);
          this.delete_loading = false;
        }
        else {
          this.message.create('success', '用户删除成功');
          this.delete_loading = false;
          this.delete_student_ids = [];
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
        this.delete_loading = false;
      });
  }


  UpdateGroupInfo() {
    this.group_info_loading = true;
    this.all_group_info = []
    this.http_client.get<MyServerResponse>(this.base_url + 'upi/groupuser/all').subscribe(
      response => {
        this.all_group_info = response.data;
        this.edit_group_student_list = new Array<Array<object>>(this.all_group_info.length);
        for (let i = 0; i < this.all_group_info.length; i++)
          this.edit_group_student_list[i] = this.all_group_info[i].students.concat();
        this.group_info_loading = false;
      },
      error => {
        this.message.create('error', '用户信息获取失败：连接服务器失败');
      });
  }

  EditGroupChange() {
    //  console.log(this.edit_group_list);
  }

  GetAllStudents() {
    this.all_studnets = []
    for (var student of this.student_info_list) {
      this.all_studnets.push({
        id: student.id,
        user_name: student.userName
      })
    }
  }

  GroupSelectOpened(opened: boolean) {
    if (opened) {
      this.user_group_loading = true;
      this.UpdateGroupInfo();
      this.user_group_loading = false;
    }
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

  RefreshDeleteCheckStatus(checked:boolean): void {
    this.delete_student_ids = []
    for(let student of this.student_info_list) {
      if(student['delete_flag'] == true ) {
        this.delete_student_ids.push(student.id);
      }
    }
    console.log(this.delete_student_ids);
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

  EditGroupStudentChange(): void {

  }

  DuplicatedGroupName(group_name: string, index: number): boolean {
    for (let i = 0; i < this.all_group_info.length; i++) {
      if (this.all_group_info[i].group_name == group_name && i != index)
        return true;
    }
    return false;
  }

  EditGroupNameDone(index: number) {
    if (this.all_group_info[index].group_name == this.edit_group_name)
      return;
    if (this.DuplicatedGroupName(this.edit_group_name, index)) {
      this.message.warning('与其他小组名重复');
      return;
    }
    else {
      let group_edit_info = {
        id: this.all_group_info[index].group_id,
        groupName: this.edit_group_name
      }
      this.http_client.post<MyServerResponse>(this.base_url + 'upi/group/single', group_edit_info).
        subscribe(response => {
          if (response.status != 200) {
            this.message.create('error', '组名编辑失败:' + response.msg);
          }
          else {
            this.message.create('success', '组名编辑成功');
            this.edit_group_name_flags[index] = false;
            this.UpdateGroupInfo();
          }
        }, error => {
          this.message.create('error', '组名编辑失败：连接服务器失败');
        });

    }
  }

  GroupStudentListChangeDone(index: number) {
    var student_id_list = []
    this.edit_group_student_list_loading = true;
    for (let student of this.edit_group_student_list[index]) {
      student_id_list.push(student['id'])
    }
    let group_edit_info = {
      group_id: this.all_group_info[index].group_id,
      student_id: student_id_list
    }
    this.http_client.post<MyServerResponse>(this.base_url + 'upi/groupuser', group_edit_info).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', this.all_group_info[index].group_name + ' 学生列表编辑失败:' + response.msg);
          this.edit_group_student_list_loading = false;
        }
        else {
          this.message.create('success', this.all_group_info[index].group_name + ' 学生列表编辑成功');
          this.edit_group_student_list_loading = false;
          this.edit_group_name_flags[index] = false;
          this.UpdateGroupInfo();
        }
      }, error => {
        this.message.create('error', this.all_group_info[index].group_name + ' 学生列表编辑失败：连接服务器失败');
        this.edit_group_student_list_loading = false;
      });
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
    anchor.download = "考试系统学生模板.xls";
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


interface UserInfo {
  id: number,
  userName: string,
  password: string,
  userType: string,
  group_list: Array<UserGroupInfo>
}

interface UserGroupInfo {
  id: number,
  groupName: string
}


interface UploadResp {
  status: number,
  msg: string,
  data: any
}

interface UserEditInfo {
  id: number,
  userName: string,
  password: string,
  userType: string,
  group_list: Array<object>
}

interface GroupInfo {
  group_id: number,
  group_name: string,
  students: Array<GroupUserInfo>
}

interface GroupUserInfo {
  user_name: string,
  id: number
}