import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FilterSortService {

	constructor() { }

	GetFilteredArray(arr: Array<any>, filter: Array<any>, filter_key: string): Array<any> {
		if(filter.length == 0) return arr;
		return arr.filter(arr_item => { 
			for(let filter_item of filter) { 
				if (arr_item[filter_key] == filter_item) return true; 
			} 
			return false;
		})
	}

	GetSearchedArray(arr: Array<any>, search_val: string, filter_key: string): Array<any> {
		if(search_val.length == 0) return arr;
		return arr.filter(arr_item => arr_item[filter_key].includes(search_val))
	}

}