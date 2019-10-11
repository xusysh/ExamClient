import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';
import { TableUpdateService } from '../../../tools/TableUpdateService.component'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadXHRArgs, NzFormatEmitEvent } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-generate-paper',
  templateUrl: './generate-paper.component.html',
  styleUrls: ['./generate-paper.component.css']
})

export class GeneratePaperComponent implements OnInit {

  searchValue = '';

  nodes = [
    {
      title: '专业核心',
      key: '专业核心',
      children: [
        {
          title: '数据结构',
          key: '数据结构',
          children: [
            { title: '线性表', key: '线性表', isLeaf: true },
            { title: '栈&队列', key: '栈&队列', isLeaf: true },
            { title: '图&树', key: '图&树', isLeaf: true }
          ]
        },
        {
          title: '计算机组成原理',
          key: '计算机组成原理',
          children: [
            { title: '数据的编码和存储', key: '数据的编码和存储', isLeaf: true },
            { title: '程序的机器级表示', key: '程序的机器级表示', isLeaf: true },
            { title: '程序的执行和存储访问', key: '程序的执行和存储访问', isLeaf: true }
          ]
        },
        {
          title: '计算机网络',
          key: '计算机网络',
          children: [
            { title: '物理层（通信基础）', key: '物理层（通信基础）', isLeaf: true },
            { title: '链路层', key: '链路层', isLeaf: true },
            { title: '网络层', key: '网络层', isLeaf: true },
            { title: '传输层', key: '传输层', isLeaf: true },
            { title: '应用层', key: '应用层', isLeaf: true }
          ]
        },
        {
          title: '数据库原理',
          key: '数据库原理',
          children: [
            { title: '关系代数', key: '关系代数', isLeaf: true },
            { title: 'SQL', key: 'SQL', isLeaf: true },
            { title: '范式理论', key: '范式理论', isLeaf: true },
          ]
        }
      ]
    },
    {
      title: '专业基础',
      key: '专业基础',
      children: [
        { title: '高等数学', key: '高等数学', isLeaf: true },
        { title: '线性代数', key: '线性代数', isLeaf: true },
        { title: '离散数学', key: '离散数学', isLeaf: true }
      ]
    },
    {
      title: '其他',
      key: '其他',
      isLeaf: true
    }
  ];

  nzEvent(event: NzFormatEmitEvent): void {
  //  console.log(event);
  }

  @ViewChild('content_canvas',{  static: false }) content_canvas_element_view: ElementRef;
  public canvas_height:number=0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height*0.85).toString() + 'px';
  }

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    private message: NzMessageService) {

  }

  ngOnInit(): void {
  }

}
