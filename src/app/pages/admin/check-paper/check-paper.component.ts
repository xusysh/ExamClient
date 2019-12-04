import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MyServerResponse } from '../../login/login.component';
import { Router } from '@angular/router';
import { FilterSortService } from 'src/app/tools/FilterSortService.component';
import { createTokenForExternalReference } from '@angular/compiler/src/identifiers';

@Component({
  selector: 'app-check-paper',
  templateUrl: './check-paper.component.html',
  styleUrls: ['./check-paper.component.css']
})

export class CheckPaperComponent implements OnInit {


  public page_index: number = 1;
  public page_size: number = 5;
  public listOfData: Array<object> = [];
  public loading: boolean = true;
  public sortValue: string | null = null;
  public sortKey: string | null = null;
  public searchGenderList: string[] = [];
  public is_downloading_template = false;
  public paper_info_list: Array<PaperBaseInfo> = [];
  paper_info_list_backup: Array<PaperBaseInfo> = [];
  create_time_sort_value = null;

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
  all_group_info: Array<object> = [];

  paper_title_search_val = "";

  delete_paper_papercodes: Array<string> = [];
  delete_loading: boolean = false;

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.group_id === o2.group_id : o1 === o2);

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  base_url: string;
  constructor(private table_update_service: TableUpdateService, private http_client: HttpClient,
    private message: NzMessageService, private router: Router,
    private filter_sort_service: FilterSortService) {
      this.base_url = sessionStorage.getItem('server_base_url');
    }

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
    this.http_client.get<MyServerResponse>(this.base_url + 'paper/all').subscribe(
      response => {
        this.paper_info_list = response.data;
        for (let paper of this.paper_info_list) {
          paper['delete_flag'] = false;
        }
        this.paper_info_list_backup = Array.from(this.paper_info_list);
        this.loading = false;
      },
      error => {
        this.message.create('error', '试卷信息获取失败：连接服务器失败');
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
    sessionStorage.setItem('paper_code', this.edit_paper_code);
    this.router.navigateByUrl("admin/generate-paper");
  }


  RefreshDeleteCheckStatus(): void {
    this.delete_paper_papercodes = []
    for (let paper of this.paper_info_list) {
      if (paper['delete_flag'] == true) {
        this.delete_paper_papercodes.push(paper.paperCode);
      }
    }
  }

  //删除单个试卷
  DeletePaper(index: number): void {
    this.current_select_paper = (this.page_index - 1) * this.page_size + index;
    let paper_delete_info = {
      paper_code: [this.paper_info_list[this.current_select_paper].paperCode]
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: paper_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'paper/del', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '试卷删除失败:' + response.msg);
        }
        else {
          this.message.create('success', '试卷 ' + this.paper_info_list[this.current_select_paper].title + ' 删除成功');
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '试卷删除失败：连接服务器失败');
      });
  }

  //批量删除试卷
  DeletePapers() {
    this.delete_loading = true;
    let paper_delete_info = {
      paper_code: this.delete_paper_papercodes
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: paper_delete_info
    };
    this.http_client.delete<MyServerResponse>(this.base_url + 'paper/del', httpOptions).
      subscribe(response => {
        if (response.status != 200) {
          this.message.create('error', '试卷删除失败:' + response.msg);
          this.delete_loading = false;
        }
        else {
          this.message.create('success', '试卷删除成功');
          this.delete_loading = false;
          this.delete_paper_papercodes = [];
          this.UpdateTableData();
        }
      }, error => {
        this.message.create('error', '试卷删除失败：连接服务器失败');
        this.delete_loading = false;
      });
  }

  UpdateGroupInfo() {
    this.all_group_info = []
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
      this.group_loading = true;
      this.UpdateGroupInfo();
      this.group_loading = false;
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

  GeneratePaper() {
    sessionStorage.setItem('paper_code', '');
    this.router.navigateByUrl("admin/generate-paper");
  }

  SearchPaperTitle() {
    this.paper_info_list = this.filter_sort_service.GetSearchedArray(this.paper_info_list, this.paper_title_search_val, "title")
  }

  ResetArrayData() {
    this.paper_title_search_val = "";
    this.create_time_sort_value = null;
    this.paper_info_list = Array.from(this.paper_info_list_backup);
  }


  TimeSortStatusChanged() {
    //  console.log(this.begin_time_sort_value)
    if (this.create_time_sort_value == null) {
      this.ResetArrayData();
      return;
    }
    this.UpdateSortedData();
  }

  UpdateSortedData() {
    let insc = this.create_time_sort_value == 'ascend'?true:false;
    this.paper_info_list = this.filter_sort_service.GetSortedDateTimeStrArray(this.paper_info_list,"createTime",insc);
    this.paper_info_list = Array.from(this.paper_info_list);
  }

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