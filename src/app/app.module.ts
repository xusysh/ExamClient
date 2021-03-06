import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {TableUpdateService} from './tools/TableUpdateService.component'

import { LoginModule } from './pages/login/login.module';
import { TestModule } from './pages/test/test.module';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { FilterSortService } from './tools/FilterSortService.component';
import { AuthService } from './tools/AuthService.component';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginModule,
    TestModule
  ],
  providers: [
    { 
      provide: NZ_I18N, 
      useValue: zh_CN 
    },
    {
      provide: 'BASE_URL',
      useValue: 'http://localhost:8080/'
    },
    {
      provide:'DBG_BASE_URL',
      useValue:'http://localhost:4200/src/dbg_data/'
    },
    TableUpdateService,
    FilterSortService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
