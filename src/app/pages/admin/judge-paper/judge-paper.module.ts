import { NgModule, Inject, ViewChild, ElementRef } from '@angular/core';

import { JudgePaperComponent } from './judge-paper.component';

import { NgZorroAntdModule, NzMessageService, NzFormatEmitEvent} from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from 'selenium-webdriver/http';



@NgModule({
  imports: [NgZorroAntdModule,CommonModule,FormsModule,ReactiveFormsModule],
  declarations: [JudgePaperComponent],
  exports: [JudgePaperComponent]
})
export class JudgePaperModule {

  search_value = '';
  selected_value = null;

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
