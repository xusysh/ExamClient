import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FilterSortService {

	constructor() { }

	GetFilteredArray(arr: Array<any>, filter: Array<any>, filter_key: string): Array<any> {
		return arr.filter(arr_item => { 
			for(let filter_item of filter) { 
				if (arr_item[filter_key] == filter_item) return true; 
			} 
			return false;
		})
	}

	GetSearchedArray(arr: Array<any>, search_val: string, filter_key: string): Array<any> {
		return arr.filter(arr_item => arr_item[filter_key].includes(search_val))
	}

	//根据首字母排序
	GetSortedArray(arr: Array<any>, filter_key: string,insc:boolean): Array<any> {
		if(insc) {
			return arr.sort((item1,item2)=>item1.localeCompare(item2, 'zh-Hans-CN', {sensitivity: 'accent'}));
		}
		else {
			return arr.sort((item1,item2)=>item1.localeCompare(item2, 'zh-Hans-CN', {sensitivity: 'accent'})).reverse();
		}
	}

}