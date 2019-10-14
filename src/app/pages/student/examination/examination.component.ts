import { Component, OnInit, Injectable, Inject, ViewChild, ElementRef } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'


@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})

export class ExaminationComponent implements OnInit {

  //当前页
  public page_index_char: string = '';
  //考试名
  public exam_name: string = "2019年10月金融科技部考试";
  //考试截止时间（毫秒）
  public deadline: number = Date.now() + 1000 * 60 * 40;
  //大题列表
  public categorys: Array<string> = ["数据结构", "计算机组成原理", "计算机网络", "数据库原理"];
  //当前所在的大题
  public current_category: number = 1;
  //当前选择的题目
  public current_question: number = 2;
  //题目
  questions = [
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
          'type': 'single',
          'answer': ['A'],
          'content': '若入栈序列为A B C D E F，且进栈和出栈可以穿插进行，则不可能的输出序列为',
          'description': '',
          'options': [
            'A.BCEAFD',
            'B.DCBAEF',
            'C.CBDAFE',
            'D.BDCAEF'
          ]
        },
        {
          'type': 'single',
          'answer': ['D'],
          'content': '若某表最常用的操作是在最后一个结点之后插入一个节点或删除最后一二个结点，则采用（）省运算时间。',
          'description': '',
          'options': [
            'A.单链表',
            'B.双链表',
            'C.单循环链表',
            'D.带头结点的双循环链表'
          ]
        },
        {
          'type': 'single',
          'answer': ['D'],
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
        },
        {
          'type': 'subjective',
          'answer': [''],
          'content': '请简述操作系统中进程之间的通信方式',
          'description': '',
          'options': ['']
        },
        {
          'type': 'judge',
          'answer': ['A'],
          'content': '判断下面的描述是否正确（）',
          'description': '继承抽象类的派生类可以被声明对像，不需要实现基类中全部纯虚函数，只需要实现在派生类中用到的纯虚函数',
          'options': ['A.正确','B.错误']
        }
      ]
    },
    {
      'field_name': '操作系统',
      'questions': []
    },
    {
      'field_name': '计算机网络',
      'questions': []
    },
    {
      'field_name': '数据库原理',
      'questions': []
    }
  ]
  //当前选中的单选项
  public radio_value: string = String.fromCharCode(0x41);
  //当前选中的多选项
  public checkbox_values=new Array<boolean>(this.questions[this.current_category].questions[this.current_question].options.length);
  //控制选择框不同状态的背景色
  public option_bgcolor: Array<string> = new Array<string>(this.questions[this.current_category].questions[this.current_question].options.length);
  public option_default_bgcolor: string = '#FFFFFF';
  //选项颜色
  public option_bdcolor: Array<string> = new Array<string>(this.questions[this.current_category].questions[this.current_question].options.length);
  public option_default_bdcolor: string = '#d4d4d4';
  //简答题编辑器和内容
  public editor = ClassicEditor;
  public editor_data='';
  public editor_config = {
    // 配置语言
    language: 'zh-cn',
    // 工具栏
    toolbar: ['heading', '|', 'bold','italic','link','bulletedList','numberedList','blockQuote','insertTable','undo','redo'],
  };

  @ViewChild('content_canvas', { static: false }) content_canvas_element_view: ElementRef;
  public canvas_height: number = 0;
  public elem_height_str: string = '500px';

  ngAfterViewInit(): void {
    this.canvas_height = this.content_canvas_element_view.nativeElement.offsetHeight;
    this.elem_height_str = Math.ceil(this.canvas_height * 0.85).toString() + 'px';
  }

  constructor() {
    this.updateRadioStatus();
    this.updateCheckboxStatus();
  }

  ngOnInit(): void {

  }

  getValue(i: number): string {
    return String.fromCharCode(0x41 + i);
  }

  getTypeStr(): string {
    let type = this.questions[this.current_category].questions[this.current_question].type;
    switch (type) {
      case 'single': return '单选题';
      case 'multi': return '不定项选择题';
      case 'judge': return '判断题';
      case 'subjective': return '简答题';
      default: break;
    }
  }

  getPageValue(i: number): string {
    return String.fromCharCode(i);
  }

  updateRadioStatus() {
    let options = this.questions[this.current_category].questions[this.current_question].options;
    for (let i = 0; i < options.length; i++) {
      if (this.radio_value.charCodeAt(0) == 0x41 + i) {
        this.option_bdcolor[i] = '#0099FF';
        this.option_bgcolor[i] = this.option_default_bgcolor;
      }
      else {
        this.option_bgcolor[i] = this.option_default_bgcolor;
        this.option_bdcolor[i] = this.option_default_bdcolor;
      }
    }
  }

  updateCheckboxStatus() {
    let options = this.questions[this.current_category].questions[this.current_question].options;
    for (let i = 0; i < options.length; i++) {
      if (this.checkbox_values[i] == true) {
        this.option_bdcolor[i] = '#0099FF';
        this.option_bgcolor[i] = this.option_default_bgcolor;
      }
      else {
        this.option_bgcolor[i] = this.option_default_bgcolor;
        this.option_bdcolor[i] = this.option_default_bdcolor;
      }
    }
  }

  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false,
    sub4: false
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  limit(){
    if(this.editor_data.length>20000) this.editor_data = this.editor_data.substring(0,20000);
  }

}