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
  selected_value = null;
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

  selected_questions = [
    {
      'field_name': '数据结构',
      'questions': [
        {
          'type': 'multi',
          'answer': ['A', 'B'],
          'content': '时间复杂度为O(nlog2n)的排序算法有（          ）',
          'description': '',
          'options': ['A.快速排序', 'B.堆排序', 'C.冒泡排序', 'D.折半插入排序']
        },
        {
          'type': 'multi',
          'answer': ['B', 'C'],
          'content': '若入栈序列为A B C D E F，且进栈和出栈可以穿插进行，则不可能的输出序列为',
          'description': '',
          'options': ['']
        },
        {
          'type': 'single',
          'answer': ['B'],
          'content': '若某表最常用的操作是在最后一个结点之后插入一个节点或删除最后一二个结点，则采用（）省运算时间。',
          'description': '',
          'options': ['']
        },
        {
          'type': 'multi',
          'answer': ['A', 'B'],
          'content': '时间复杂度为O(nlog2n)的排序算法有（          ）',
          'description': '',
          'options': ['A.快速排序', 'B.堆排序', 'C.冒泡排序', 'D.折半插入排序']
        },
        {
          'type': 'single',
          'answer': ['C'],
          'content': '对于int *pa[5] ;的描述，正确的是（    ）',
          'description': '',
          'options': [
            "A.pa是一个指向数组的指针，所指向的数组是5个int型元素",
            "B.pa是一个指向某个数组第5个元素的指针，该元素是int型变量",
            "C.pa[5]表示某个数组第5个元素的值",
            "D.pa是一个具有5个元素的指针数组，每个元素是一个int型指针"
          ]
        }
      ]
    },
    {
      'field_name': '计算机组成原理',
      'questions': [
        {
          'type': 'single',
          'answer': ['A'],
          'content': '下列关于RISC的叙述中，错误的是（）。',
          'description': '',
          'options': [
            'A.RISC普遍采用微程序控制器',
            'B.RISC大多数指令在一个时钟周期内完成',
            'C.RISC的内部通用寄存器数量相对CISC多',
            'D.RISC的指令数、寻址方式和指令格式种类相对CISC少'
          ]
        },
        {
          'type': 'single',
          'answer': ['A'],
          'content': '指出下列代码的缺陷（      ）。',
          'description': 'float   f[10];\n\
  // 假设这里有对f进行初始化的代码\n\
  ….\n\
  //for循环需要遍历f中所有元素\n\
  for(int i = 0; i < 10;)\n\
  {\n\
  if( f[++i] == 0 )\n\
  break;\n\
  }',
          'options': [
            'A.for(int i = 0; i < 10;)这一行写错了',
            'B.f是float型数据直接做相等判断有风险',
            'C.f[++i]应该是f[i++]',
            'D.没有缺陷']
        }
      ]
    },
    {
      'field_name': '操作系统'
    },
    {
      'field_name': '计算机网络'
    },
    {
      'field_name': '数据库原理'
    }
  ]

  questions = [
    {
      'type': 'single',
      'answer': ['A'],
      'content': '下列关于RISC的叙述中，错误的是（）。',
      'description': '',
      'options': [
        'A.RISC普遍采用微程序控制器',
        'B.RISC大多数指令在一个时钟周期内完成',
        'C.RISC的内部通用寄存器数量相对CISC多',
        'D.RISC的指令数、寻址方式和指令格式种类相对CISC少'
      ]
    },
    {
      'type': 'single',
      'answer': ['C'],
      'content': '对于int *pa[5] ;的描述，正确的是（    ）',
      'description': '',
      'options': [
        "A.pa是一个指向数组的指针，所指向的数组是5个int型元素",
        "B.pa是一个指向某个数组第5个元素的指针，该元素是int型变量",
        "C.pa[5]表示某个数组第5个元素的值",
        "D.pa是一个具有5个元素的指针数组，每个元素是一个int型指针"
      ]
    },
    {
      'type': 'single',
      'answer': ['A'],
      'content': '指出下列代码的缺陷（      ）。',
      'description': 'float   f[10];\n\
// 假设这里有对f进行初始化的代码\n\
….\n\
//for循环需要遍历f中所有元素\n\
for(int i = 0; i < 10;)\n\
{\n\
if( f[++i] == 0 )\n\
break;\n\
}',
      'options': [
        'A.for(int i = 0; i < 10;)这一行写错了',
        'B.f是float型数据直接做相等判断有风险',
        'C.f[++i]应该是f[i++]',
        'D.没有缺陷']
    },
    {
      'type': 'multi',
      'answer': ['A', 'B'],
      'content': '时间复杂度为O(nlog2n)的排序算法有（          ）',
      'description': '',
      'options': ['A.快速排序', 'B.堆排序', 'C.冒泡排序', 'D.折半插入排序']
    }
  ]

  nzEvent(event: NzFormatEmitEvent): void {
    //  console.log(event);
  }

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor(private http_client: HttpClient, @Inject('BASE_URL') private base_url: string,
    private message: NzMessageService) {

  }

  ngOnInit(): void {
  }

}
