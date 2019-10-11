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

  search_value = '';

  nodes = [
    {
      title: '计算机专业核心',
      key: '计算机专业核心',
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
            { title: '程序的执行', key: '程序的执行', isLeaf: true }
          ]
        },
        {
          title: '计算机网络',
          key: '计算机网络',
          children: [
            { title: '通信基础', key: '通信基础', isLeaf: true },
            { title: '网桥&路由', key: '网桥&路由', isLeaf: true },
            { title: '以太网', key: '以太网', isLeaf: true },
            { title: 'IP网络', key: 'IP网络', isLeaf: true },
            { title: 'TCP&UDP', key: 'TCP&UDP', isLeaf: true },
            { title: '应用层协议', key: '应用层协议', isLeaf: true }
          ]
        },
        {
          title: '操作系统',
          key: '操作系统',
          children: [
            { title: '进程同步', key: '进程同步', isLeaf: true },
            { title: '进程调度与死锁', key: '进程调度与死锁', isLeaf: true },
            { title: '输入输出与中断', key: '输入输出与中断', isLeaf: true },
            { title: '存储管理', key: '存储管理', isLeaf: true },
            { title: '文件管理', key: '文件管理', isLeaf: true },
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
      title: '计算机专业基础',
      key: '计算机专业基础',
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
