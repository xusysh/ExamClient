import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'

@Component({
  selector: 'app-check-student',
  templateUrl: './check-student.component.html',
  styleUrls: ['./check-student.component.css']
})

export class CheckStudentComponent implements OnInit {

  emm: string = "asd"

  pageIndex: number = 1;
  pageSize: number = 5;
  listOfData: Array<object> = [];
  loading: boolean = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  filterGender = [{ text: 'male', value: 'male' }, { text: 'female', value: 'female' }];
  searchGenderList: string[] = [];

  public drawer_visible: boolean = false;
  public dialog_visible: boolean = false;
  public dialog_ok_loading: boolean = false;
  public isAllDisplayDataChecked = false;
  public isIndeterminate = false;
  public edit_user_name: string = '';
  public edit_password: string = '';
  public edit_group_list: Array<object> = [];

  public tags = ['产品开发科', '微服务小组', '考试系统小组'];
  public inputVisible = false;
  public inputValue = '';

  //假数据
  public users_group_list = [['产品开发科','招投标项目组','考试系统小组'],['需求分析科'],['产品开发科', '人工智能小组'],
  ['鑫源融信公司','招投标项目组'],['运营支持科', '考试系统小组', '微服务小组']];

  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  constructor(private table_update_service: TableUpdateService) { }

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
      this.pageIndex = 1;
    }
    this.loading = true;
    this.table_update_service
      .getUsers(this.pageIndex, 10, this.sortKey!, this.sortValue!, this.searchGenderList)
      .subscribe((data: any) => {
        this.loading = false;
        this.listOfData = data.results;
      });
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.UpdateTableData(true);
  }

  EditStudentInfo(index: number): void {
    this.drawer_visible = true;
  }

  AddStudentInfo(): void {
    this.drawer_visible = true;
  }

  DrawerClose(): void {
    this.drawer_visible = false;
  }

  DialogOKHandle(): void {
    this.dialog_ok_loading = true;

    setTimeout(() => {
      this.dialog_visible = false;
      this.dialog_ok_loading = false;
    }, 3000);
  }

  DialogCancelHandle(): void {
    this.dialog_visible = false;
  }

  refreshStatus(): void {
  }

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }


}
