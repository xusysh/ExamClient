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
  public paper_info_list: Array<PaperBaseInfo> = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public is_allDisplay_data_checked = false;
  public is_indeterminate = false;
  public edit_paper_code: string = '';

  public user_group_tags = [];
  public inputVisible = false;
  public inputValue = '';
  public edit_paper_info_loading = false;

  current_select_paper: number = 0;
  group_loading: boolean;
  all_group_info:Array<object> = [];
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.group_id === o2.group_id : o1 === o2);

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    @Inject('BASE_URL') private base_url: string, private message: NzMessageService,private router:Router) { }

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
        this.paper_info_list = response.data;
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

  EditPaper(index: number): void {
    this.current_select_paper = (this.page_index - 1) * this.page_size + index;
    this.edit_paper_code = this.paper_info_list[this.current_select_paper].paperCode;
    sessionStorage.setItem('paper_code',this.edit_paper_code);
    this.router.navigateByUrl("admin/generate-paper");
  }

  //删除单个试卷
  DeletePaper(index: number): void {
    this.current_select_paper = (this.page_index - 1) * this.page_size + index;
    let user_delete_info = {
      id: [this.paper_info_list[this.current_select_paper].id]
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
          this.message.create('success', '用户 ' + this.paper_info_list[this.current_select_paper].title + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '用户删除失败：连接服务器失败');
      });
    this.drawer_visible = false;
  }


  UpdateGroupInfo(){
    this.all_group_info=[]
    this.http_client.get<MyServerResponse>(this.base_url + 'upi/groupuser/all').subscribe(
      response => {
        this.all_group_info = response.data;
      },
      error => {
        this.message.create('error', '用户信息获取失败：连接服务器失败');
      });
  }

  EditGroupChange() {
  //  console.log(this.edit_group_list);
  }

	GroupSelectOpened(opened: boolean) {
		if (opened) {
      this.group_loading=true;
      this.UpdateGroupInfo();
      this.group_loading=false;
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
  paper_info:PaperBaseInfo,
  beginTime: string,
  endTime: string,
//  duration: number,
  duration: string,
  status: string
}

interface PaperBaseInfo {
  id: number,
  paperCode: string,
  createTime:string,
  lastModifiedTime: string,
  createUserId: number,
  title: string,
  description: string
}