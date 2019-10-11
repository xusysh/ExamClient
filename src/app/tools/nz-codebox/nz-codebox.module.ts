import { NgModule } from '@angular/core';
import { NzCodeBoxComponent } from './nz-codebox.component';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  imports: [CommonModule, NzIconModule, NzToolTipModule],
  declarations: [NzCodeBoxComponent],
  exports: [NzCodeBoxComponent]
})
export class NzCodeBoxModule {}